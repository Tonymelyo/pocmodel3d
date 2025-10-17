"use client";

import type { TerrainData } from "@/types/terrain";

interface TerrainFormProps {
  formData: TerrainData;
  onChange: (data: TerrainData) => void;
}

export default function TerrainForm({ formData, onChange }: TerrainFormProps) {
  const handleChange = (
    field: keyof TerrainData,
    value: string | number
  ) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Localisation
        </label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="ex: Marseille, Provence-Alpes-Côte d'Azur"
          className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40"
          required
        />
      </div>

      <div>
        <label htmlFor="surface" className="block text-sm font-medium mb-2">
          Surface (m²)
        </label>
        <input
          id="surface"
          type="number"
          value={formData.surface || ""}
          onChange={(e) => handleChange("surface", Number(e.target.value))}
          placeholder="ex: 3500"
          min="0"
          className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40"
          required
        />
      </div>

      <div>
        <label htmlFor="constraints" className="block text-sm font-medium mb-2">
          Contraintes
        </label>
        <textarea
          id="constraints"
          value={formData.constraints}
          onChange={(e) => handleChange("constraints", e.target.value)}
          placeholder="ex: Zone légèrement inondable, proche d'une route principale, pente modérée..."
          rows={4}
          className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40 resize-none"
          required
        />
      </div>
    </div>
  );
}
