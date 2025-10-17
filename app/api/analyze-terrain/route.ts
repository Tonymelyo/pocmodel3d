import { NextResponse } from "next/server";
import { generateTerrainModel } from "@/lib/ai/tripo3d";
import { analyzeTerrainWithGPT4o } from "@/lib/ai/openai";
import { fileToBase64 } from "@/lib/utils";
import type { AnalyzeTerrainResponse, AnalyzeTerrainError } from "@/types/api";

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const description = formData.get("description") as string | null;

    if (!imageFile) {
      return NextResponse.json<AnalyzeTerrainError>(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json<AnalyzeTerrainError>(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json<AnalyzeTerrainError>(
        { error: "Invalid image format. Only JPEG and PNG are supported." },
        { status: 400 }
      );
    }

    const maxSize = 20 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json<AnalyzeTerrainError>(
        { error: "Image size must be less than 20MB" },
        { status: 400 }
      );
    }

    const imageBase64 = await fileToBase64(imageFile);

    const [modelUrl, analysis] = await Promise.all([
      generateTerrainModel(imageBase64),
      analyzeTerrainWithGPT4o(imageBase64, description),
    ]);

    const processingTime = Date.now() - startTime;

    const response: AnalyzeTerrainResponse = {
      modelUrl,
      analysis,
      processingTime,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error analyzing terrain:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json<AnalyzeTerrainError>(
      {
        error: "Failed to analyze terrain",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
