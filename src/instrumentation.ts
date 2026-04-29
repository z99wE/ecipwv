export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Google Cloud Trace
    try {
      const trace = await import('@google-cloud/trace-agent');
      trace.start({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Used if Secret Manager isn't directly bound
      });
      console.log('✅ Google Cloud Trace Initialized');
    } catch (e) {
      console.warn('⚠️ Cloud Trace failed to initialize:', e);
    }

    // Initialize Google Cloud Logging
    try {
      const { Logging } = await import('@google-cloud/logging');
      const logging = new Logging({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
      const log = logging.log('electiq-application-log');
      
      // Global logging helper for the server
      (global as { gcLog?: (message: string, severity: string) => Promise<void> }).gcLog = async (message: string, severity = "INFO") => {
        const metadata = {
          severity,
          resource: { type: 'global' },
        };
        const entry = log.entry(metadata, { message, timestamp: new Date() });
        await log.write(entry);
      };
      
      console.log('✅ Google Cloud Logging Initialized');
    } catch (e) {
      console.warn('⚠️ Cloud Logging failed to initialize:', e);
    }
  }
}
