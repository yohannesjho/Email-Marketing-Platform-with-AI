import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

 
export async function generateTemplate(prompt: string) {
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `
      ONLY return raw JSON. Do NOT include explanations, code fences.
      Generate an email template in strict JSON format with the following fields:
      {
        "name": string,    // a short descriptive label for this template, based on the purpose (e.g. "Welcome Email", "Discount Offer")
        "subject": string, // the subject line of the email
        "body": string     // the email body text
      }

      The "name" field must be a clear, human-readable summary of the template's intent
      (NOT "generate template", NOT repeating the whole subject or body).

      Prompt: ${prompt}
    `,
});

  let text = response.text ?? "{}";

  // Strip any code fences if present
  text = text.replace(/```json|```/gi, "").trim();

  // Extract JSON even if extra text exists
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON object found in AI response: ${text}`);
  }

  try {
    const json = JSON.parse(jsonMatch[0]) as {
      name: string;
      subject: string;
      body: string;
    };
    

    return json;
  } catch (err) {
    console.error("Failed to parse JSON:", jsonMatch[0], err);
    throw err; 
  }
}
