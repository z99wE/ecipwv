export function validateSyncConfig(config: { apiKey: string; projectId: string }) {
  if (!config.apiKey || !config.projectId) {
    throw new Error("Invalid configuration");
  }
  return true;
}
