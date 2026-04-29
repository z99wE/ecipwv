import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY!;

// Vertex AI via Gemini API — works with a standard Google AI API key
// For Vertex AI Search data store, we also try that endpoint
export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const GEMINI_KEY = process.env.VERTEX_AI_KEY || process.env.GOOGLE_API_KEY;

    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    // Use Gemini 1.5 Flash for Voti assistant
    const systemPrompt = `You are Voti, an expert AI assistant for Indian election processes. 
You have deep knowledge of:
- The Constitution of India (especially Articles 324-329 on elections)
- Election Commission of India (ECI) guidelines and procedures
- Voter registration, EVMs, model code of conduct
- Polling booth procedures and voter rights
- Indian electoral system — Lok Sabha, Rajya Sabha, State Assemblies

STRICT GUIDELINES:
1. DISCLAIMER: Every response should reflect that "Citizens should verify information basis the latest information by themselves as this is an AI-generated response."
2. CONTACT: Always quote ECI Helpline: 1950 and Website: https://voters.eci.gov.in/. Do NOT provide any other URLs or phone numbers.
3. SCOPE: Answer ONLY election-related questions. Refuse all other topics.
4. STYLE: Answer clearly and concisely. Cite relevant Article/Section/ECI guideline. Under 150 words. Use simple language.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: query }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    const responseText = await response.text();
    console.log('[Vertex/Voti] Status:', response.status);

    if (!response.ok) {
      console.error('[Vertex/Voti] Error:', responseText.slice(0, 300));
      // Return a smart fallback
      return NextResponse.json({
        results: [{ snippet: getFallbackResponse(query) }]
      });
    }

    const data = JSON.parse(responseText);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(query);

    return NextResponse.json({
      results: [{ snippet: text }]
    });
  } catch (error) {
    console.error('[Vertex/Voti] Exception:', error);
    return NextResponse.json({
      results: [{ snippet: getFallbackResponse('election') }]
    });
  }
}

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('age') || q.includes('18') || q.includes('eligible')) {
    return 'Every Indian citizen who is at least 18 years old is eligible to vote, per Article 326 of the Constitution of India. You must be registered in the electoral roll of the constituency where you reside. Register at voters.eci.gov.in. Helpline: 1950.';
  }
  if (q.includes('id') || q.includes('document') || q.includes('proof')) {
    return 'Valid photo IDs for voting: Voter Photo ID Card (EPIC), Aadhaar Card, Passport, Driving Licence, PAN Card, MNREGA Job Card, Service ID (Government employees), or Bank/Post Office Passbook with photo. Any ONE is sufficient.';
  }
  if (q.includes('booth') || q.includes('station') || q.includes('where')) {
    return 'Find your polling booth at voters.eci.gov.in or call 1950. Your booth is assigned based on your voter registration address. Booths are typically open 7 AM to 6 PM. Check your Voter ID slip for the exact booth number.';
  }
  if (q.includes('evm') || q.includes('machine') || q.includes('vvpat')) {
    return 'EVMs are standalone units with no internet/Bluetooth connectivity. Each EVM is paired with a VVPAT machine for transparency. You can verify your vote on the VVPAT slip. EVMs are tested by multiple independent agencies before every election.';
  }
  return `Regarding "${query}": For authoritative answers on Indian election procedures, please visit eci.gov.in or call the national voter helpline at 1950. I can help you understand voter registration, polling procedures, Model Code of Conduct, and your constitutional rights as a voter.`;
}
