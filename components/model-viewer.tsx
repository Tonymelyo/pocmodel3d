"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

function getProxyUrl(originalUrl: string): string {
  // If URL is from Tripo3D, proxy it through our API to avoid CORS issues
  if (originalUrl.includes("tripo3d.com")) {
    return `/api/proxy-model?url=${encodeURIComponent(originalUrl)}`;
  }
  return originalUrl;
}

function Model({ url }: { url: string }) {
  const proxiedUrl = getProxyUrl(url);
  const { scene } = useGLTF(proxiedUrl);
  return <primitive object={scene} scale={1} />;
}

function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4f46e5" wireframe />
    </mesh>
  );
}

interface ModelViewerProps {
  modelUrl: string;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-foreground/20 bg-background">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Environment preset="studio" />

        <Suspense fallback={<LoadingBox />}>
          <Model url={modelUrl} />
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
