import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Validate that the URL is from Tripo3D domain
    if (!url.includes("tripo3d.com")) {
      return NextResponse.json(
        { error: "Invalid model URL domain" },
        { status: 400 }
      );
    }

    // Fetch the model from Tripo3D
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch model: ${response.status}`);
    }

    // Get the file as a buffer
    const buffer = await response.arrayBuffer();

    // Return the model with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "model/gltf-binary",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error proxying model:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to proxy model",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
