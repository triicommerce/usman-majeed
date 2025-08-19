import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function SpinningLogo({ color }: { color: string }) {
  const ref = useRef<any>();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.5;
      ref.current.rotation.y += delta * 0.8;
    }
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

export const Logo3DStudio: React.FC = () => {
  const [color, setColor] = useState('#06b6d4');
  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">3D Logo Designer</h2>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-slate-300">Primary Color</label>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      </div>
      <div className="h-[420px] rounded border border-slate-700 overflow-hidden">
        <Canvas camera={{ position: [3, 3, 3] }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} />
          <SpinningLogo color={color} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

