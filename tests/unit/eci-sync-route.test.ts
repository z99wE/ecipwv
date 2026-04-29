import { TextDecoder, TextEncoder } from "util";

if (typeof globalThis.TextDecoder === "undefined") {
  Object.assign(globalThis, { TextDecoder });
}

if (typeof globalThis.TextEncoder === "undefined") {
  Object.assign(globalThis, { TextEncoder });
}

class TestRequest {
  url: string;
  body: unknown;

  constructor(url: string, body?: unknown) {
    this.url = url;
    this.body = body;
  }

  async json() {
    return this.body;
  }
}

if (typeof globalThis.Request === "undefined") {
  Object.assign(globalThis, { Request: TestRequest });
}

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status || 200,
      body,
      json: async () => body,
    }),
  },
}));

jest.mock("cheerio", () => ({
  load: () => () => ({
    each: jest.fn(),
  }),
}));

jest.mock("@/services/firestore.service", () => ({
  firestoreService: {
    getECISync: jest.fn(),
    getUserECIContext: jest.fn(),
    saveECISync: jest.fn(),
  },
}));

import { firestoreService } from "@/services/firestore.service";

let GET: typeof import("@/app/api/eci/sync/route").GET;
let POST: typeof import("@/app/api/eci/sync/route").POST;

beforeAll(async () => {
  const route = await import("@/app/api/eci/sync/route");
  GET = route.GET;
  POST = route.POST;
});

const mockedFirestoreService = firestoreService as jest.Mocked<typeof firestoreService>;

const originalFetch = global.fetch;

beforeAll(() => {
  global.fetch = jest.fn() as unknown as typeof fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe("ECI Sync API route", () => {
  test("GET returns cached data and user context when available", async () => {
    mockedFirestoreService.getECISync.mockResolvedValue({ id: "latest_sync", source: "cache", topic: "status", content: "ok", fetchedAt: null });
    mockedFirestoreService.getUserECIContext.mockResolvedValue({ lastSync: "today" });

    const request = { url: "http://localhost/api/eci/sync?uid=test-user" } as unknown as Request;
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toBe("cache");
    expect(body.userContext).toEqual({ lastSync: "today" });
  });

  test("POST fetches live sources and saves sync result", async () => {
    const request = {
      url: "http://localhost/api/eci/sync",
      json: async () => ({ uid: "test-user" }),
    } as unknown as Request;

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source.primary).toContain("Election Commission of India");
    expect(mockedFirestoreService.saveECISync).toHaveBeenCalledWith(expect.any(Object), "test-user");
  });
});
