/**
 * src/app/api/voti/memory/route.ts
 *
 * Memory-aware Voti API endpoint.
 * Uses aiService.askVoti() which integrates:
 *   - Firestore history (persistent memory)
 *   - Gemini 2.5 Flash SDK (personalized response)
 *   - Firebase Analytics (event tracking)
 *
 * POST /api/voti/memory
 * Body: { uid: string, userName: string, query: string }
 */

import { NextResponse } from "next/server";
import { aiService } from "@/services/ai.service";

const UID_PATTERN = /^[A-Za-z0-9_-]{6,128}$/;
const MAX_QUERY_LENGTH = 500;

function isValidUid(uid: string | null): uid is string {
  return Boolean(uid && UID_PATTERN.test(uid));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!isValidUid(uid)) {
      return NextResponse.json({ error: "A valid uid is required" }, { status: 400 });
    }

    const history = await aiService.getVotiHistory(uid, 20);
    return NextResponse.json(history);
  } catch (error) {
    console.error("[Voti Memory GET] Error:", error);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      uid?: string;
      userName?: string;
      query?: string;
    };
    const { uid, userName, query } = body;
    const trimmedQuery = query?.trim();

    if (!isValidUid(uid ?? null) || !trimmedQuery) {
      return NextResponse.json(
        { error: "A valid uid and query are required" },
        { status: 400 }
      );
    }

    const safeUid = uid ?? "";

    if (trimmedQuery.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { error: `Query must be ${MAX_QUERY_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    // Call the memory-aware AI service
    const safeUserName = typeof userName === "string" ? userName.slice(0, 80) : "Voter";
    const response = await aiService.askVoti(safeUid, safeUserName, trimmedQuery);

    // Clean infographic tag from visible text
    const cleanText = response.text.replace(/\[INFOGRAPHIC:.*?\]/g, "").trim();

    return NextResponse.json({
      answer: cleanText,
      hasInfographic: response.hasInfographic,
      infographicTopic: response.infographicTopic,
    });
  } catch (error) {
    console.error("[Voti Memory API] Error:", error);
    return NextResponse.json(
      {
        answer:
          "Voti is temporarily unavailable. Please try again or call the ECI Voter Helpline: 1950.",
      },
      { status: 500 }
    );
  }
}
