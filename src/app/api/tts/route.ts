import { NextResponse } from 'next/server';

// Google Cloud Text-to-Speech API with Indian English voices
// Uses the configured Google API key for Cloud TTS

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_API_KEY;

// Indian English voices available in Google Cloud TTS
const INDIAN_ENGLISH_VOICES = [
  { languageCode: 'en-IN-Standard-A', name: 'en-IN-Standard-A', gender: 'FEMALE' },
  { languageCode: 'en-IN-Standard-B', name: 'en-IN-Standard-B', gender: 'MALE' },
  { languageCode: 'en-IN-Wavenet-A', name: 'en-IN-Wavenet-A', gender: 'FEMALE' },
  { languageCode: 'en-IN-Wavenet-B', name: 'en-IN-Wavenet-B', gender: 'MALE' },
  { languageCode: 'en-IN-Wavenet-C', name: 'en-IN-Wavenet-C', gender: 'MALE' },
  { languageCode: 'en-IN-Wavenet-D', name: 'en-IN-Wavenet-D', gender: 'FEMALE' },
  { languageCode: 'en-IN-Neural2-A', name: 'en-IN-Neural2-A', gender: 'FEMALE' },
  { languageCode: 'en-IN-Neural2-B', name: 'en-IN-Neural2-B', gender: 'MALE' },
  { languageCode: 'en-IN-Neural2-C', name: 'en-IN-Neural2-C', gender: 'MALE' },
  { languageCode: 'en-IN-Neural2-D', name: 'en-IN-Neural2-D', gender: 'FEMALE' },
];

// Premium Indian voices (best quality)
const PREMIUM_VOICE = 'en-IN-Neural2-A'; // Female Indian English Neural2 voice

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      console.error('[TTS] Google Cloud API key not configured');
      return NextResponse.json({ 
        error: 'TTS service not configured',
        fallback: true 
      }, { status: 500 });
    }

    const selectedVoice = voice || PREMIUM_VOICE;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const payload = {
      input: { text },
      voice: {
        languageCode: 'en-IN',
        name: selectedVoice,
        ssmlGender: selectedVoice.includes('A') || selectedVoice.includes('C') ? 'FEMALE' : 'MALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
        sampleRateHertz: 24000,
        effectsProfileId: ['telephony-class-application']
      }
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
      console.error('[TTS] Google Cloud TTS error:', errorText);
      
      // If Neural2 voice fails, try Wavenet as fallback
      if (selectedVoice.includes('Neural2')) {
        payload.voice.name = 'en-IN-Wavenet-A';
        const retryResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          return NextResponse.json({ 
            audioContent: data.audioContent,
            voice: 'en-IN-Wavenet-A'
          });
        }
      }
      
      return NextResponse.json({ 
        error: 'Failed to generate speech',
        details: errorText 
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      audioContent: data.audioContent,
      voice: selectedVoice,
      mimeType: 'audio/mp3'
    });

  } catch (error) {
    console.error('[TTS] Exception:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: String(error) 
    }, { status: 500 });
  }
}

// GET endpoint to list available Indian voices
export async function GET() {
  return NextResponse.json({
    voices: INDIAN_ENGLISH_VOICES,
    recommended: PREMIUM_VOICE
  });
}