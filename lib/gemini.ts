import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

 
export async function generateTemplate(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      ONLY return raw JSON. Do NOT include explanations, code fences, or extra text.
      Generate an email template in strict JSON format with the following fields and for the name field in the json give an appropriate name based on prompt:
      {
        "name": string,    
        "subject": string,
        "body": string
      }

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
