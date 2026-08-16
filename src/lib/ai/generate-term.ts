import { GoogleGenAI } from "@google/genai";
import { generatedTermSchema } from "./schema";
import type { GeneratedTerm } from "@/types/term";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateTerm(term: string): Promise<GeneratedTerm> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    Generate vocabulary learning data for the term "${term}".

    Rules:

    - Use simple English.
    - Return valid JSON only.
    - Do not use markdown.
    - Do not include trailing commas.
    - Do not wrap the JSON in markdown code blocks.
    - Do not include explanations outside JSON.
    - Return only the JSON object.
    - exampleSentences MUST contain exactly 3 items.
    - synonyms MUST contain exactly 3 items.
    - antonyms MUST contain exactly 3 items.
    - Never return more or fewer than 3 items in these arrays.

    Return exactly this structure:

    {
      "term": "string",
      "termType": "word | phrase | idiom | phrasal_verb | expression",
      "definition": "string",
      "exampleSentences": [
        "string",
        "string",
        "string"
      ],
      "synonyms": [
        "string",
        "string",
        "string"
      ],
      "antonyms": [
        "string",
        "string",
        "string"
      ],
      "difficulty": "beginner | intermediate | advanced"
    }
  `;

  let response;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed`, error);

      if (attempt === 3) {
        throw error;
      }

      await sleep(1000);
    }
  }

  if (!response) {
    throw new Error("Failed to generate term after 3 attempts");
  }

  const text = response.text;

  if (!text) {
    throw new Error("No response from Gemini");
  }

  const parsed = JSON.parse(text);

  const normalized = {
    ...parsed,
    exampleSentences: parsed.exampleSentences?.slice(0, 3),
    synonyms: parsed.synonyms?.slice(0, 3),
    antonyms: parsed.antonyms?.slice(0, 3),
  };

  const generatedTerm = generatedTermSchema.parse(normalized);

  return generatedTerm;
}