"use client";

import { useState } from "react";
import TerrainUploader from "@/components/terrain-uploader";
import ModelViewer from "@/components/model-viewer";
import AnalysisReport from "@/components/analysis-report";
import type { AnalyzeTerrainResponse } from "@/types/api";

type AppState = "idle" | "analyzing" | "completed" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<AnalyzeTerrainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Veuillez sélectionner une image");
      return;
    }

    setState("analyzing");
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", selectedImage);
      formDataToSend.append("description", "Analyse de terrain pour projet immobilier");

      const response = await fetch("/api/analyze-terrain", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue");
      }

      const data: AnalyzeTerrainResponse = await response.json();
      setResult(data);
      setState("completed");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur inconnue est survenue";
      setError(errorMessage);
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            POC Model 3D - Analyse de Terrains
          </h1>
          <p className="text-foreground/70">
            Génération de modèles 3D et analyse par IA pour l&apos;investissement immobilier
          </p>
        </header>

        {state === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-background border border-foreground/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Photo du Terrain</h2>
              <TerrainUploader
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedImage}
              className="w-full py-3 px-6 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyser le Terrain
            </button>
          </form>
        )}

        {state === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Analyse en cours...</h2>
            <p className="text-foreground/70 text-center max-w-md">
              Génération du modèle 3D et analyse IA du terrain. Cela peut prendre
              1-2 minutes.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Erreur
            </h2>
            <p className="text-foreground/80 mb-4">{error}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {state === "completed" && result && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Résultats de l&apos;Analyse</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-foreground/20 rounded-lg font-medium hover:bg-foreground/5 transition-colors"
              >
                Nouvelle Analyse
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-background border border-foreground/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Modèle 3D</h3>
                <ModelViewer modelUrl={result.modelUrl} />
                <p className="text-sm text-foreground/60 mt-2">
                  Temps de traitement : {(result.processingTime / 1000).toFixed(1)}s
                </p>
              </div>

              <div className="bg-background border border-foreground/10 rounded-lg p-6">
                <AnalysisReport analysis={result.analysis} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
