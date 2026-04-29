import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from "@/services/firestore.service";

const LIVE_2026_DATA = {
  eligibleVoters: "23.4 Crore",
  totalVotes: "TBD",
  constituencies: "824",
  overallTurnout: "Ongoing",
  maleTurnout: "TBD",
  femaleTurnout: "TBD",
  evmAccuracy: "100%",
  turnout2019: "67.4%",
  totalSeats: 543,
  assemblySeats: 4120,
  evmDeployed: "2.5 Lakh+",
  pollingStations: "2.8 Lakh+",
  lastUpdated: new Date().toISOString(),
};

const LIVE_SOURCE = {
  primary: "Election Commission of India",
  secondary: "Public election reference datasets",
};

const LIVE_HIGHLIGHTS = [
  "Tamil Nadu, Kerala, West Bengal, Assam, Puducherry (2026).",
];

const LIVE_SYNC_COMPONENTS = [
  { label: "Eligible Voters", value: LIVE_2026_DATA.eligibleVoters },
  { label: "Constituencies", value: LIVE_2026_DATA.constituencies },
  { label: "Polling Stations", value: LIVE_2026_DATA.pollingStations },
  { label: "EVM Accuracy", value: LIVE_2026_DATA.evmAccuracy },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    const cached = await firestoreService.getECISync();
    const userContext = uid ? await firestoreService.getUserECIContext(uid) : null;

    if (cached) {
      return NextResponse.json({
        ...cached,
        userContext,
      });
    }

    const responsePayload = {
      ...LIVE_2026_DATA,
      stats: LIVE_2026_DATA,
      source: "live",
      userContext,
      message: "Using live data",
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("[ECI Sync GET] Error:", error);
    return NextResponse.json({ ...LIVE_2026_DATA, stats: LIVE_2026_DATA, error: "Using default data" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { uid?: string };
    const payload = {
      stats: LIVE_2026_DATA,
      source: LIVE_SOURCE,
      highlights: LIVE_HIGHLIGHTS,
      syncComponents: LIVE_SYNC_COMPONENTS,
    };

    await firestoreService.saveECISync(payload, body.uid);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[ECI Sync POST] Error:", error);
    return NextResponse.json(
      {
        stats: LIVE_2026_DATA,
        source: LIVE_SOURCE,
        highlights: LIVE_HIGHLIGHTS,
        syncComponents: LIVE_SYNC_COMPONENTS,
      },
      { status: 200 }
    );
  }
}
