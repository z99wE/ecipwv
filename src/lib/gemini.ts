/**
 * src/lib/gemini.ts
 *
 * Official Google Generative AI SDK initialization.
 * Uses @google/generative-ai (modular, tree-shakeable).
 * API key is server-side only — never exposed to client bundles.
 *
 * IAM Requirements (for Vertex AI path):
 *   - roles/aiplatform.user  (Service Account)
 *   - roles/secretmanager.secretAccessor (to read GEMINI_API_KEY from Secret Manager)
 */

import {
  GoogleGenerativeAI,
  GenerativeModel,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// ─── Safety settings shared across all models ───────────────────────────────
const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// ─── SDK Initialization ──────────────────────────────────────────────────────
// SECURITY: GEMINI_API_KEY is a server-side env var — not prefixed NEXT_PUBLIC_.
// In production, this value is fetched from Google Cloud Secret Manager
// during deployment build (see instrumentation.ts + deploy.sh).
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

if (!apiKey && typeof window === "undefined") {
  console.warn("[Gemini] API key not set. Set GEMINI_API_KEY or GOOGLE_API_KEY.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ─── Voti's primary model: Gemini 1.5 Flash (stable) ──────────────────
export const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Stable Flash model
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
  },
  safetySettings: SAFETY_SETTINGS,
});

// ─── Pro model for deep analysis (Myth-Buster, Infographic context) ──────────
export const proModel: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro", // Stable Pro model
  generationConfig: {
    maxOutputTokens: 4096,
    temperature: 0.4,
  },
  safetySettings: SAFETY_SETTINGS,
});

// ─── Factory: create a model instance with a custom system instruction ───────
export function createVotiModel(systemInstruction: string): GenerativeModel {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
    },
    safetySettings: SAFETY_SETTINGS,
  });
}

export { genAI };
