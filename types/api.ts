import type { TerrainAnalysis } from "./terrain";

export interface AnalyzeTerrainResponse {
  modelUrl: string;
  analysis: TerrainAnalysis;
  processingTime: number;
}

export interface AnalyzeTerrainError {
  error: string;
  details?: string;
}

export interface Tripo3DTaskResponse {
  code: number;
  data: {
    task_id: string;
  };
}

export interface Tripo3DTaskStatus {
  code: number;
  data: {
    task_id: string;
    type: string;
    status: "queued" | "running" | "success" | "failed";
    output?: {
      model?: string;
    };
    progress?: number;
  };
}
