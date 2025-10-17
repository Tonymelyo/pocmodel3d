import OpenAI from "openai";
import type { TerrainAnalysis } from "@/types/terrain";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Tu es un expert en analyse de terrains et en investissement immobilier.
Analyse les images de terrains et fournis des recommandations d'investissement structurées.
Réponds UNIQUEMENT en JSON valide.`;

export async function analyzeTerrainWithGPT4o(
  imageBase64: string,
  description: string
): Promise<TerrainAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const userPrompt = `Analyse ce terrain et fournis une analyse structurée.

Description fournie par l'utilisateur : ${description}

Fournis un objet JSON avec cette structure exacte :
{
  "constraints": {
    "flood_risk": "low" | "moderate" | "high",
    "slope": "flat" | "slight" | "moderate" | "steep",
    "access": "direct_road" | "secondary_road" | "limited" | "difficult",
    "vegetation": "none" | "sparse" | "moderate" | "dense"
  },
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "projects": [
    {
      "type": "residential" | "commercial" | "eco_hotel" | "green_park" | "industrial",
      "description": "Description du projet",
      "justification": "Pourquoi ce projet est adapté"
    }
  ],
  "investors": ["Type d'investisseur 1", "Type d'investisseur 2"],
  "potential": "low" | "medium" | "medium-high" | "high"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const analysis: TerrainAnalysis = JSON.parse(content);

    if (
      !analysis.constraints ||
      !analysis.strengths ||
      !analysis.projects ||
      !analysis.investors ||
      !analysis.potential
    ) {
      throw new Error("Invalid analysis structure from OpenAI");
    }

    return analysis;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI analysis failed: ${error.message}`);
    }
    throw error;
  }
}
