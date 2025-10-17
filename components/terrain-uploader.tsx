"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface TerrainUploaderProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
}

export default function TerrainUploader({
  onImageSelect,
}: TerrainUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onImageSelect(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full h-64 border-2 border-dashed border-foreground/20 rounded-lg hover:border-foreground/40 transition-colors flex flex-col items-center justify-center gap-4"
        >
          <svg
            className="w-12 h-12 text-foreground/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div className="text-center">
            <p className="text-foreground font-medium">Cliquez pour sélectionner une image</p>
            <p className="text-foreground/60 text-sm mt-1">JPEG ou PNG, max 20MB</p>
          </div>
        </button>
      ) : (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-foreground/20">
          <Image src={preview} alt="Terrain preview" fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
