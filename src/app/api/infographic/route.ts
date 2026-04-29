import { NextResponse } from 'next/server';

// API_KEY is loaded at request time

// ─── Role: ElectiQ Visual AI — Gemini 2.5 Flash ─────────────────
const INFOGRAPHIC_SYSTEM_PROMPT = `
You are the ElectiQ Infographic Engine, powered by Gemini 2.5 Flash.
YOUR TASK: Generate a high-fidelity, professional infographic image for the Indian Electoral Ecosystem.

STRICT VISUAL GUIDELINES:
1. AESTHETIC: Modern, clean, "Stripe-style" flat vector illustration. 
2. COLORS: Use the Indian Tricolor palette: Saffron (#FF9933), White (#FFFFFF), and Green (#138808). Primary background should be Indigo (#000080) or White.
3. CONTENT: Focus ONLY on election assistance, voter rights, EVM/VVPAT mechanics, or polling station guides.
4. WATERMARK & DISCLAIMER: Every image MUST have the following text at the bottom:
   - "Created with ElectiQ"
   - "Disclaimer: Citizens should verify information basis the latest information by themselves as this is an AI-generated infographic."
5. CONTACT INFO: Every image MUST clearly display:
   - "ECI Helpline: 1950"
   - "Official Website: https://voters.eci.gov.in/"
6. RESTRICTIONS: Do NOT include ANY other phone numbers, hyperlinks, or URLs.
7. SCOPE: Reject any non-election related requests.
8. TEXT: Keep text minimal and highly accurate. Use clear icons and numbers.
9. COMPOSITION: Balanced, centered, high-contrast, and premium.
`;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const API_KEY = process.env.GOOGLE_API_KEY;
    if (!API_KEY) {
      console.error("[Infographic] Missing API key");
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Basic election-topic verification
    const electionKeywords = ['vote', 'election', 'voter', 'eci', 'booth', 'evm', 'vvpat', 'candidate', 'constituency', 'polling', 'register', 'id', 'card', 'indian', 'india'];
    const isElectionRelated = electionKeywords.some(kw => query.toLowerCase().includes(kw));

    if (!isElectionRelated) {
      return NextResponse.json({ error: 'This engine only generates election-related infographics.' }, { status: 403 });
    }

    // Task-specific prompt refinement
    const prompt = `Generate a high-fidelity infographic image for this election topic: "${query}". 
    Follow these rules:
    - Theme: Indian Election Assistance
    - Style: Premium flat vector (Stripe aesthetic)
    - Colors: Saffron, White, Green, Indigo
    - Include Disclaimer: "Citizens should verify information basis the latest information by themselves as this is an AI-generated infographic."
    - Include Contact: ECI Helpline 1950, Website https://voters.eci.gov.in/
    - No other URLs or phone numbers allowed.
    - Minimal text, maximum clarity.`;

    // Fetch from Gemini 1.5 Flash model
    const EFFECTIVE_KEY = API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${EFFECTIVE_KEY}`;
    
    const svgPrompt = `
      Create a beautiful, high-fidelity, professional SVG infographic for the topic: "${query}".
      
      STRUCTURE:
      1. CANVAS: 800x1200 vertical layout.
      2. BACKGROUND: Clean white or very light indigo (#F8FAFC).
      3. HEADER: Large bold title at the top in Indigo (#000080).
      4. BODY: 3-4 distinct "Cards" or sections arranged vertically.
      5. ICONS: Simple geometric icons for each section (use <rect>, <circle>, <path>).
      6. COLORS: Saffron (#FF9933), White (#FFFFFF), and Green (#138808) as accents.
      7. FOOTER: Branded footer with "Created with ElectiQ", "ECI Helpline: 1950", and the disclaimer: "Citizens should verify information basis the latest information by themselves as this is an AI-generated infographic."
      
      TECHNICAL RULES:
      1. Use ONLY standard SVG elements. No external images.
      2. All text must be legible (font-family: sans-serif).
      3. Use gradients and subtle shadows (<filter>) for a premium look.
      4. Return ONLY the raw <svg>...</svg> code. No markdown.
    `;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: svgPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8000,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Infographic] Gemini API Error:", errorText);
      return NextResponse.json({ error: `Gemini API failed: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    let fullText = "";

    if (data.candidates?.[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.text) fullText += part.text;
      }
    }

    // Robust SVG extraction
    let svgCode = "";
    const svgStart = fullText.indexOf('<svg');
    const svgEnd = fullText.lastIndexOf('</svg>');
    
    if (svgStart !== -1 && svgEnd !== -1) {
      svgCode = fullText.substring(svgStart, svgEnd + 6);
    } else {
      // Fallback: clean markdown
      svgCode = fullText.replace(/```svg/g, '').replace(/```/g, '').trim();
    }

    if (!svgCode || !svgCode.includes('<svg')) {
      console.error("[Infographic] No valid SVG data in response", fullText.slice(0, 500));
      return NextResponse.json({ error: "Failed to generate visual data" }, { status: 500 });
    }

    // Convert SVG to Data URL
    const base64Svg = Buffer.from(svgCode).toString('base64');
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      query,
    });

  } catch (error) {
    console.error('[Infographic] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
