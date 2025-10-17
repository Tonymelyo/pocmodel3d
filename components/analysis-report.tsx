"use client";

import type { TerrainAnalysis } from "@/types/terrain";

interface AnalysisReportProps {
  analysis: TerrainAnalysis;
}

export default function AnalysisReport({ analysis }: AnalysisReportProps) {
  const potentialColors = {
    low: "bg-red-500/10 text-red-700 dark:text-red-400",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    "medium-high": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    high: "bg-green-500/10 text-green-700 dark:text-green-400",
  };

  const riskColors = {
    low: "bg-green-500/10 text-green-700 dark:text-green-400",
    moderate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    high: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Analyse du Terrain</h2>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            potentialColors[analysis.potential]
          }`}
        >
          Potentiel : {analysis.potential}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Contraintes</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-foreground/10 bg-background/50">
            <p className="text-sm text-foreground/60">Risque inondation</p>
            <div
              className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium mt-1 ${
                riskColors[analysis.constraints.flood_risk]
              }`}
            >
              {analysis.constraints.flood_risk}
            </div>
          </div>
          <div className="p-3 rounded-lg border border-foreground/10 bg-background/50">
            <p className="text-sm text-foreground/60">Pente</p>
            <p className="font-medium mt-1">{analysis.constraints.slope}</p>
          </div>
          <div className="p-3 rounded-lg border border-foreground/10 bg-background/50">
            <p className="text-sm text-foreground/60">Accès</p>
            <p className="font-medium mt-1">{analysis.constraints.access}</p>
          </div>
          <div className="p-3 rounded-lg border border-foreground/10 bg-background/50">
            <p className="text-sm text-foreground/60">Végétation</p>
            <p className="font-medium mt-1">{analysis.constraints.vegetation}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Points Forts</h3>
        <ul className="space-y-2">
          {analysis.strengths.map((strength, index) => (
            <li
              key={index}
              className="flex items-start gap-2 p-2 rounded border border-green-500/20 bg-green-500/5"
            >
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Projets Recommandés</h3>
        <div className="space-y-3">
          {analysis.projects.map((project, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-foreground/10 bg-background/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded bg-foreground/10 text-xs font-medium">
                  {project.type}
                </span>
              </div>
              <h4 className="font-semibold mb-1">{project.description}</h4>
              <p className="text-sm text-foreground/70">{project.justification}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Investisseurs Cibles</h3>
        <ul className="space-y-2">
          {analysis.investors.map((investor, index) => (
            <li
              key={index}
              className="flex items-center gap-2 p-2 rounded border border-foreground/10"
            >
              <svg
                className="w-5 h-5 text-foreground/60 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{investor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
