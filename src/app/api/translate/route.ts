import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Text and targetLanguage are required' }, { status: 400 });
    }

    const apiKey = process.env.TRANSLATION_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Translation API Key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to translate');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Translation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
