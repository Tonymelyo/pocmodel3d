import type { Tripo3DTaskResponse, Tripo3DTaskStatus } from "@/types/api";

const TRIPO3D_API_KEY = process.env.TRIPO3D_API_KEY;
const TRIPO3D_BASE_URL = "https://api.tripo3d.ai/v2/openapi";
const MAX_POLL_ATTEMPTS = 60;
const POLL_INTERVAL = 5000;

export async function uploadImageToTripo3D(imageBase64: string): Promise<string> {
  if (!TRIPO3D_API_KEY) {
    throw new Error("TRIPO3D_API_KEY is not configured");
  }

  const response = await fetch(`${TRIPO3D_BASE_URL}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TRIPO3D_API_KEY}`,
    },
    body: JSON.stringify({
      type: "image_to_model",
      file: {
        type: "base64",
        data: imageBase64,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tripo3D API error: ${response.status} - ${errorText}`);
  }

  const data: Tripo3DTaskResponse = await response.json();

  if (!data.data?.task_id) {
    throw new Error("Invalid response from Tripo3D API: missing task_id");
  }

  return data.data.task_id;
}

export async function pollTripo3DTask(taskId: string): Promise<string> {
  if (!TRIPO3D_API_KEY) {
    throw new Error("TRIPO3D_API_KEY is not configured");
  }

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const response = await fetch(`${TRIPO3D_BASE_URL}/task/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TRIPO3D_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tripo3D polling error: ${response.status} - ${errorText}`);
    }

    const data: Tripo3DTaskStatus = await response.json();

    console.log(
      `[Tripo3D] Attempt ${attempt + 1}/${MAX_POLL_ATTEMPTS} - Status: ${data.data.status}${
        data.data.progress ? ` - Progress: ${data.data.progress}%` : ""
      }`
    );

    if (data.data.status === "success") {
      const modelUrl =
        data.data.output?.pbr_model ||
        data.data.result?.pbr_model?.url;

      if (!modelUrl) {
        console.error("[Tripo3D] Response structure:", JSON.stringify(data, null, 2));
        throw new Error("Model URL not found in successful response");
      }

      console.log("[Tripo3D] Model generation completed successfully");
      return modelUrl;
    }

    if (data.data.status === "failed") {
      throw new Error("Tripo3D task failed");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error("Tripo3D task timeout: exceeded maximum polling time");
}

export async function generateTerrainModel(imageBase64: string): Promise<string> {
  console.log("[Tripo3D] Starting model generation...");
  const taskId = await uploadImageToTripo3D(imageBase64);
  console.log(`[Tripo3D] Task created with ID: ${taskId}`);
  const modelUrl = await pollTripo3DTask(taskId);
  console.log(`[Tripo3D] Model ready at: ${modelUrl}`);
  return modelUrl;
}
