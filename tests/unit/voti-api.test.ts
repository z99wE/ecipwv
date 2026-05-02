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

jest.mock("@/lib/firebase", () => ({
  db: {},
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("@/services/firestore.service", () => ({
  firestoreService: {
    getVotiHistory: jest.fn(),
    saveVotiExchange: jest.fn(),
    getVoterQueryTopics: jest.fn(),
  },
}));

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockImplementation(() => ({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => "AI Response Content" },
      }),
    })),
  })),
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
    HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
    HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
    HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  },
  HarmBlockThreshold: {
    BLOCK_LOW_AND_ABOVE: "BLOCK_LOW_AND_ABOVE",
    BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE",
  },
}));

// FORCE environment variable for the duration of this test file
Object.defineProperty(process.env, 'GEMINI_API_KEY', {
  value: 'test-api-key',
  writable: true
});

jest.mock("@/services/ai.service", () => ({
  aiService: {
    getVotiHistory: jest.fn(),
    askVoti: jest.fn(),
  },
}));

import { POST } from "@/app/api/voti/route";
import { GET as GETMemory } from "@/app/api/voti/memory/route";

describe("Voti AI API Routes", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("POST /api/voti smoke test", async () => {
    const req = new MockRequest("http://localhost/api/voti", {
      query: "How do I vote?",
      uid: "user-1234567",
    });

    const res = await POST(req as unknown as Request);
    expect(res.status).toBe(200);
  });

  test("GET /api/voti/memory smoke test", async () => {
    const req = new MockRequest("http://localhost/api/voti/memory?uid=user-1234567");
    const res = await GETMemory(req as unknown as Request);
    expect(res.status).toBe(200);
  });
});
