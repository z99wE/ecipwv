import { validateSyncConfig } from "./sync-logic";

describe("ECI Sync Logic", () => {
  it("should validate a correct config", () => {
    const config = { apiKey: "key-123", projectId: "project-abc" };
    expect(validateSyncConfig(config)).toBe(true);
  });

  it("should throw an error for missing apiKey", () => {
    const config = { apiKey: "", projectId: "project-abc" };
    expect(() => validateSyncConfig(config)).toThrow("Invalid configuration");
  });
});
