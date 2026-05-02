import { TextDecoder, TextEncoder } from "util";

// Polyfills for Next.js Request/Response in Jest
if (typeof globalThis.TextDecoder === "undefined") Object.assign(globalThis, { TextDecoder });
if (typeof globalThis.TextEncoder === "undefined") Object.assign(globalThis, { TextEncoder });

class MockRequest {
  url: string;
  _json: unknown;
  constructor(url: string, json?: unknown) {
    this.url = url;
    this._json = json;
  }
  async json() { return this._json; }
}

if (typeof globalThis.Request === "undefined") {
  Object.assign(globalThis, { Request: MockRequest });
}

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@/services/firestore.service", () => ({
  firestoreService: {
    getVotiHistory: jest.fn(),
    saveVotiExchange: jest.fn(),
    getVoterQueryTopics: jest.fn(),
  },
}));

// Mock the AI SDK
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockImplementation(() => ({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => "AI Response Content" },
      }),
    })),
  })),
}));

import { POST } from "@/app/api/voti/route";
import { GET as GETMemory } from "@/app/api/voti/memory/route";
import { firestoreService } from "@/services/firestore.service";

const mockedFirestore = firestoreService as jest.Mocked<typeof firestoreService>;

describe("Voti AI API Routes", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("POST /api/voti returns AI response and saves history", async () => {
    mockedFirestore.getVotiHistory.mockResolvedValue([]);
    
    const req = new MockRequest("http://localhost/api/voti", {
      message: "How do I vote?",
      uid: "user-123",
    });

    const res = await POST(req as unknown as Request);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.text).toBe("AI Response Content");
    expect(mockedFirestore.saveVotiExchange).toHaveBeenCalled();
  });

  test("GET /api/voti/memory returns recent topics", async () => {
    mockedFirestore.getVoterQueryTopics.mockResolvedValue(["Topic 1", "Topic 2"]);
    
    const req = new MockRequest("http://localhost/api/voti/memory?uid=user-123");

    const res = await GETMemory(req as unknown as Request);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.topics).toContain("Topic 1");
  });
});
