export interface TerrainData {
  location: string;
  surface: number;
  constraints: string;
}

export interface TerrainConstraints {
  flood_risk: "low" | "moderate" | "high";
  slope: "flat" | "slight" | "moderate" | "steep";
  access: "direct_road" | "secondary_road" | "limited" | "difficult";
  vegetation: "none" | "sparse" | "moderate" | "dense";
}

export interface ProjectRecommendation {
  type: "residential" | "commercial" | "eco_hotel" | "green_park" | "industrial";
  description: string;
  justification: string;
}

export interface TerrainAnalysis {
  constraints: TerrainConstraints;
  strengths: string[];
  projects: ProjectRecommendation[];
  investors: string[];
  potential: "low" | "medium" | "medium-high" | "high";
}
