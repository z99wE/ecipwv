import { NextResponse } from 'next/server';

// Google Cloud Speech-to-Text API for voice recognition
// Supports Indian English and Hindi-accented English

const GOOGLE_SPEECH_API_KEY = process.env.GOOGLE_SPEECH_API_KEY || process.env.GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(request: Request) {
  try {
    const { audioContent, mimeType } = await request.json();

    if (!audioContent) {
      return NextResponse.json({ error: 'Audio content is required' }, { status: 400 });
    }

    const apiKey = GOOGLE_SPEECH_API_KEY;
    if (!apiKey) {
      console.error('[STT] Google Cloud API key not configured');
      return NextResponse.json({ 
        error: 'STT service not configured',
        transcription: '' 
      }, { status: 500 });
    }

    // Determine the actual mime type from the audio data
    const actualMimeType = mimeType || 'audio/webm;codecs=opus';
    
    // Convert audio to FLAC or linear16 for better compatibility with Google Cloud STT
    // Google Cloud STT supports: FLAC, LINEAR16, MULAW, OGG_OPUS, WEBM_OPUS
    const supportedMimeTypes = {
      'audio/webm': 'audio/webm;codecs=opus',
      'audio/webm;codecs=opus': 'audio/webm;codecs=opus',
      'audio/mp4': 'audio/mp4',
      'audio/mpeg': 'audio/mp3',
      'audio/mp3': 'audio/mp3',
      'audio/wav': 'audio/wav',
      'audio/x-wav': 'audio/wav',
    };

    const cloudMimeType = supportedMimeTypes[actualMimeType as keyof typeof supportedMimeTypes] || actualMimeType;

    const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

    const payload = {
      config: {
        encoding: cloudMimeType.includes('opus') ? 'OGG_OPUS' : 
                 cloudMimeType.includes('wav') ? 'LINEAR16' :
                 cloudMimeType.includes('mp3') ? 'MP3' : 'OGG_OPUS',
        sampleRateHertz: 24000,
        languageCode: 'en-IN',
        // Enable automatic punctuation for better readability
        enableAutomaticPunctuation: true,
        // Enable word confidence scores
        enableWordConfidence: true,
        // Enable word time offsets
        enableWordTimeOffsets: true,
        // Model selection - use phone_call for better accuracy with microphone input
        model: 'default',
        // Use enhanced model for better accuracy
        useEnhanced: true,
        // Alternative language codes for code-switching (Hindi-English)
        alternativeLanguageCodes: ['hi-IN', 'en-US'],
      },
      audio: {
        content: audioContent,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[STT] Google Cloud STT error:', errorText);
      
      // Try with different encoding as fallback
      if (cloudMimeType.includes('opus')) {
        payload.config.encoding = 'MP3';
        payload.config.sampleRateHertz = 16000;
        const retryResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          const transcription = data.results?.[0]?.alternatives?.[0]?.transcript || '';
          const confidence = data.results?.[0]?.alternatives?.[0]?.confidence || 0;
          return NextResponse.json({ 
            transcription,
            confidence,
            language: 'en-IN'
          });
        }
      }
      
      return NextResponse.json({ 
        error: 'Failed to transcribe speech',
        details: errorText,
        transcription: ''
      }, { status: 500 });
    }

    const data = await response.json();
    
    // Extract the best transcription
    const bestAlternative = data.results?.[0]?.alternatives?.[0];
    const transcription = bestAlternative?.transcript || '';
    const confidence = bestAlternative?.confidence || 0;

    // Log for debugging
    if (transcription) {
      console.log('[STT] Transcription:', transcription, 'Confidence:', confidence);
    }

    return NextResponse.json({
      transcription,
      confidence,
      language: 'en-IN',
      alternatives: data.results?.[0]?.alternatives?.slice(0, 3) || []
    });

  } catch (error) {
    console.error('[STT] Exception:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: String(error),
      transcription: '' 
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    service: 'Speech-to-Text',
    status: 'ready',
    supportedLanguages: ['en-IN', 'hi-IN', 'en-US'],
    supportedEncodings: ['OGG_OPUS', 'LINEAR16', 'MP3', 'FLAC']
  });
}