import { NextRequest, NextResponse } from "next/server";

// Use the Maps API key for Geocoding and Places
const MAPS_KEY = process.env.NEXT_PUBLIC_MAPS_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY || "";

interface AirQualityIndex {
  code?: string;
  aqiDisplay?: string | number;
  aqi?: string | number;
  category?: string;
}

interface AirQualityResponse {
  indexes?: AirQualityIndex[];
}

interface PlaceResult {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GooglePlacesResponse {
  status?: string;
  results?: PlaceResult[];
}

async function getWeather(lat: number, lon: number) {
  // Open-Meteo: completely free, no API key required, very reliable
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,relative_humidity_2m,windspeed_10m&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Weather fetch failed");
  const d = await res.json();
  return {
    temp: Math.round(d.current.temperature_2m),
    description: weatherCodeToText(d.current.weathercode),
    humidity: d.current.relative_humidity_2m,
    wind: Math.round(d.current.windspeed_10m),
  };
}

async function getAirQuality(lat: number, lng: number) {
  const AQ_KEY = process.env.AIR_QUALITY_API_KEY || process.env.GOOGLE_API_KEY;
  if (!AQ_KEY) return null;
  
  try {
    const res = await fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${AQ_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: { latitude: lat, longitude: lng } }),
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data: AirQualityResponse = await res.json();
    if (data.indexes && data.indexes.length > 0) {
      const aqiIndex = data.indexes.find((idx) => idx.code === 'ind_cpcb') || data.indexes[0];
      return {
        aqi: aqiIndex.aqiDisplay || aqiIndex.aqi,
        category: aqiIndex.category,
      };
    }
  } catch (e) {
    console.warn('[Location] Air Quality API failed:', e);
  }
  return null;
}

function weatherCodeToText(code: number): string {
  if (code === 0) return "clear sky ☀️";
  if (code <= 3) return "partly cloudy ⛅";
  if (code <= 49) return "foggy 🌫️";
  if (code <= 67) return "rainy 🌧️";
  if (code <= 77) return "snowy 🌨️";
  if (code <= 82) return "showers 🌦️";
  if (code <= 99) return "thunderstorm ⛈️";
  return "variable";
}

async function geocodePincode(q: string): Promise<{ lat: number; lng: number; city: string }> {
  // Try Google Maps Geocoding first
  if (MAPS_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&components=country:IN&key=${MAPS_KEY}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      const d = await res.json();
      console.log('[Location] Google geocode status:', d.status, 'for query:', q);
      if (d.status === 'OK' && d.results?.length) {
        const loc = d.results[0].geometry.location;
        const city =
          d.results[0].address_components?.find((c: { types: string[]; long_name: string }) =>
            c.types.includes("locality") || c.types.includes("postal_town") || c.types.includes("sublocality_level_1")
          )?.long_name ||
          d.results[0].formatted_address.split(",")[0];
        return { lat: loc.lat, lng: loc.lng, city };
      }
    } catch (e) {
      console.warn('[Location] Google geocode failed, falling back:', e);
    }
  }

  // Fallback: use Nominatim (OpenStreetMap — free, no key)
  // Use postalcode parameter for pincode search
  const nomUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(q)}&country=in&format=json&limit=1`;
  const res = await fetch(nomUrl, {
    headers: { 'User-Agent': 'ElectiQ/1.0 (election-hackathon)' },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  console.log('[Location] Nominatim results:', data.length, 'for query:', q);
  
  if (!data.length) {
    // Try without postalcode parameter
    const nomUrl2 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ", India")}&format=json&limit=1`;
    const res2 = await fetch(nomUrl2, {
      headers: { 'User-Agent': 'ElectiQ/1.0 (election-hackathon)' },
      next: { revalidate: 3600 },
    });
    const data2 = await res2.json();
    if (!data2.length) throw new Error(`Cannot find location: ${q}`);
    return {
      lat: parseFloat(data2[0].lat),
      lng: parseFloat(data2[0].lon),
      city: data2[0].display_name.split(",")[0],
    };
  }
  
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    city: data[0].display_name.split(",")[0],
  };
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(nomUrl, {
      headers: { 'User-Agent': 'ElectiQ/1.0 (election-hackathon)' },
      next: { revalidate: 3600 },
    });
    const d = await res.json();
    return d.address?.city || d.address?.town || d.address?.suburb || "Your Location";
  } catch {
    return "Your Location";
  }
}

async function getNearestBooths(lat: number, lng: number, city: string) {
  // Try Google Places Nearby
  if (MAPS_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=polling+booth+election+school+community+hall&key=${MAPS_KEY}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      const d: GooglePlacesResponse = await res.json();
      console.log('[Location] Places status:', d.status, 'results:', d.results?.length);
      if (d.status === 'OK' && d.results?.length) {
        return d.results.slice(0, 3).map((p) => ({
          name: p.name,
          address: p.vicinity,
          location: p.geometry.location,
          distance: calcDistance(lat, lng, p.geometry.location.lat, p.geometry.location.lng),
        }));
      }
    } catch (e) {
      console.warn('[Location] Places API failed:', e);
    }
  }

  // Fallback: return constituency-based ECI information
  return getECIBooths(city);
}

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`;
}

function getECIBooths(city: string) {
  return [
    {
      name: `${city} Municipal Corporation School`,
      address: `Near main road, ${city}. Call ECI helpline 1950 to confirm.`,
      distance: "< 2km estimated",
    },
    {
      name: "Community Hall / Gram Panchayat Office",
      address: `Booth location varies by ward. Voter helpline: 1950`,
      distance: "nearby",
    },
    {
      name: "Government Higher Secondary School",
      address: `Check your Voter ID slip or visit voters.eci.gov.in`,
      distance: "nearby",
    },
  ];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const latP = searchParams.get("lat");
  const lngP = searchParams.get("lng");

  try {
    let lat: number, lng: number, city: string;

    if (latP && lngP) {
      lat = parseFloat(latP);
      lng = parseFloat(lngP);
      city = await reverseGeocode(lat, lng);
    } else if (q) {
      const geo = await geocodePincode(q);
      lat = geo.lat;
      lng = geo.lng;
      city = geo.city;
    } else {
      return NextResponse.json({ error: "Provide q or lat/lng" }, { status: 400 });
    }

    const [weatherBase, booths, airQuality] = await Promise.all([
      getWeather(lat, lng),
      getNearestBooths(lat, lng, city),
      getAirQuality(lat, lng),
    ]);

    return NextResponse.json({
      weather: { ...weatherBase, city, airQuality },
      booths,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error('[Location] Final error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
