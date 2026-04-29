"use client";
import { useState } from "react";
import { MapPin, Thermometer, Navigation, Loader2, AlertCircle } from "lucide-react";

interface WeatherData {
  temp: number;
  description: string;
  city: string;
  airQuality?: {
    aqi: string | number;
    category: string;
  };
}

interface BoothData {
  name: string;
  address: string;
  distance?: string;
}

export function LocationWeather() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [booths, setBooths] = useState<BoothData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    setBooths([]);

    try {
      const res = await fetch(`/api/location?q=${encodeURIComponent(input.trim())}`);
      if (!res.ok) throw new Error("Location not found");
      const data = await res.json();
      setWeather(data.weather);
      setBooths(data.booths || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not fetch location data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/location?lat=${latitude}&lng=${longitude}`);
          if (!res.ok) throw new Error("Could not fetch data for your location");
          const data = await res.json();
          setWeather(data.weather);
          setBooths(data.booths || []);
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : "Failed to fetch location data.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please enter your PIN code manually.");
        setLoading(false);
      }
    );
  };

  return (
    <section id="location" className="border-y py-24" style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text)" }}>
            Your Polling Day, Planned
          </h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Enter your PIN code or city to find the nearest polling booth and check live weather.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto flex gap-3 mb-8">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter PIN code or city (e.g. 400001)"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000080]/40 focus:border-[#000080] transition-all shadow-sm"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-[#000080] text-white font-bold text-sm hover:bg-[#4f46e5] transition-all active:scale-95 disabled:opacity-60 cursor-pointer shadow-lg"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
          <button
            onClick={useMyLocation}
            disabled={loading}
            title="Use my current location"
            className="px-4 py-3.5 rounded-2xl border bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-[#FF9933] hover:text-[#FF9933] transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            style={{ borderColor: "var(--border)" }}
          >
            <Navigation className="h-4 w-4" />
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="max-w-xl mx-auto flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm mb-6">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {(weather || booths.length > 0) && (
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">


            {/* Weather card */}
            {weather && (
              <div className="bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 shadow-2xl hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                    <Thermometer className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Election Day Climate</p>
                    <p className="text-xl font-black text-white">{weather.city}</p>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-4">
                  <div className="text-6xl font-black text-white tracking-tighter">
                    {weather.temp}°C
                  </div>
                  {weather.airQuality && (
                    <div className="text-right">
                      <div className="text-3xl font-black text-white tracking-tighter">AQI {weather.airQuality.aqi}</div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{weather.airQuality.category}</div>
                    </div>
                  )}
                </div>
                <p className="text-slate-500 font-medium capitalize text-lg mb-6">{weather.description}</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-700">
                    {weather.temp < 35
                      ? "✅ Perfect voting conditions. Carry your ID!"
                      : "☀️ High heat warning. Stay hydrated and use the priority queue for elders."}
                  </p>
                </div>
              </div>
            )}

            {/* Booths card */}
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 shadow-2xl hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <MapPin className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Geolocation Discovery</p>
                  <p className="text-xl font-black text-white">Nearby Stations</p>
                </div>
              </div>
              {booths.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-500 font-medium">No direct booth data for this sector. <br/>Checking local electoral rolls...</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {booths.map((b, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 hover:shadow-md transition-all border border-white/5 hover:border-white/10 group/item">
                      <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-800 shadow-sm text-[#FF9933] font-black text-xs flex items-center justify-center border border-white/10 group-hover/item:bg-orange-500 group-hover/item:text-white transition-colors">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-black text-white">{b.name}</p>
                        <p className="text-sm text-slate-400 font-medium mb-1">{b.address}</p>
                        {b.distance && <p className="text-xs font-black text-orange-400 uppercase tracking-widest">{b.distance} away</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
