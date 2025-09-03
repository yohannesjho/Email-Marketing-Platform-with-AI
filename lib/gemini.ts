import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function cleanTemplateBody(body: string): string {
  return body
    .replace(/\*\*/g, "") // remove bold markdown
    .replace(/\\n/g, "\n") // convert literal \n to real line breaks
    .replace(/^\s*[\*\-]\s*/gm, "") // remove bullet points (* or -) at line start
    .replace(/\s+$/gm, ""); // trim trailing spaces per line
}

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
    // Clean the body before returning
    json.body = cleanTemplateBody(json.body);
    return json;
  } catch (err) {
    console.error("Failed to parse JSON:", jsonMatch[0], err);
    throw err;
  }
}
