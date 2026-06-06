import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float, PerspectiveCamera, Text, Html, useProgress, Bvh, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { CakeConfig, TierConfig, DecorationConfig } from '../types';
import { FROSTING_FLAVORS, SPONGE_FLAVORS } from '../constants';
import { dragStore } from '../store/dragStore';

import CakeBoard from './cake/CakeBoard';
import CakeTier from './cake/CakeTier';
import Coating from './cake/Coating';
import FillingLayer from './cake/FillingLayer';
import Drip from './cake/Drip';
import Decoration from './cake/Decoration';

function Loader() {
  const { progress, loaded, total } = useProgress();
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="flex flex-col items-center justify-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 min-w-[240px]">
        <div className="w-10 h-10 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-3">Loading Assets</span>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden shadow-inner">
          <div
            className="bg-brand-pink h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {loaded > 0 ? `${Math.round(progress)}% (${loaded}/${total})` : 'Initializing...'}
        </span>
      </div>
    </Html>
  );
}

function Topper({ config }: { config: CakeConfig['topper'] }) {
  if (config.type === 'none') return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Stick */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1]} />
        <meshStandardMaterial color="#ddd" metalness={0.8} roughness={0.2} />
      </mesh>

      <group position={[0, 0.5, 0]}>
        {config.type === 'heart' && (
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshStandardMaterial color={config.color} />
          </mesh>
        )}

        {config.type === 'text' && config.text && (
          <Text
            fontSize={0.25}
            color={config.color}
            font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvL-7mveZDuzer4qyUlaXv_L2mzL_ixti2.woff"
            anchorX="center"
            anchorY="middle"
          >
            {config.text}
          </Text>
        )}

        {config.type === 'star' && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.2} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function Tier({ tier, index, totalTiers, cumulativeHeight, config, onUpdateDecoration, selectedId, setSelectedId }: {
  tier: TierConfig;
  index: number;
  totalTiers: number;
  cumulativeHeight: number;
  config: CakeConfig;
  onUpdateDecoration: (tierId: string, decoId: string, updates: Partial<DecorationConfig>) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const frosting = FROSTING_FLAVORS.find(f => f.id === tier.frostingId) || FROSTING_FLAVORS[0];
  const sponge = SPONGE_FLAVORS.find(s => s.id === tier.flavorId) || SPONGE_FLAVORS[0];

  // The center of this tier
  const yPos = cumulativeHeight + tier.height / 2;

  return (
    <group position={[0, yPos, 0]}>
      {/* Base Sponge (CakeTier) */}
      <CakeTier radius={tier.radius} height={tier.height} color={sponge.hex} />

      {/* Coating (Frosting) */}
      <Coating
        radius={tier.radius}
        height={tier.height}
        color={frosting.hex}
        style={tier.frostingStyle}
      />

      {/* Filling Layer at the bottom of the tier (unless it's the bottom tier, or maybe between layers) */}
      {index > 0 && (
        <group position={[0, -tier.height / 2, 0]}>
          <FillingLayer radius={tier.radius * 0.95} color={frosting.hex} />
        </group>
      )}

      {/* Decorations */}
      {tier.decorations.map(deco => (
        <Decoration
          key={deco.id}
          tierId={tier.id}
          config={deco}
          isSelected={selectedId === deco.id}
          onSelect={() => setSelectedId(deco.id)}
          onChange={(updates) => onUpdateDecoration(tier.id, deco.id, updates)}
        />
      ))}

      {/* Drip */}
      {tier.hasDrip && (
        <Drip radius={tier.radius} height={tier.height} color={tier.dripColor} />
      )}

      {/* Topper */}
      {index === totalTiers - 1 && (
        <group position={[0, tier.height / 2, 0]}>
          <Topper config={config.topper} />
        </group>
      )}
    </group>
  );
}

function CakeScene({
  config,
  onUpdateDecoration,
  selectedId,
  setSelectedId
}: {
  config: CakeConfig;
  onUpdateDecoration: (tierId: string, decoId: string, updates: Partial<DecorationConfig>) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  let cumulativeHeight = 0;

  return (
    <group position={[0, -0.8, 0]}>
      {/* Professional Board / Base Plate */}
      <CakeBoard color={config.basePlateColor} />

      {/* Cake Shadow */}
      <ContactShadows
        position={[0, -0.1, 0]}
        opacity={0.6}
        scale={6}
        blur={1.5}
        far={2}
      />

      {config.tiers.map((tier, index) => {
        const currentY = cumulativeHeight;
        cumulativeHeight += tier.height;
        return (
          <Tier
            key={tier.id}
            tier={tier}
            index={index}
            totalTiers={config.tiers.length}
            cumulativeHeight={currentY}
            config={config}
            onUpdateDecoration={onUpdateDecoration}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        );
      })}
    </group>
  );
}

export default function CakeCanvas({
  config,
  onChange,
  selectedId,
  setSelectedId
}: {
  config: CakeConfig;
  onChange: (config: CakeConfig) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dpr, setDpr] = useState(2);

  useEffect(() => {
    return dragStore.subscribe((state) => {
      setIsDragging(state.isDragging);
    });
  }, []);

  const handleUpdateDecoration = (tierId: string, decoId: string, updates: Partial<DecorationConfig>) => {
    onChange({
      ...config,
      tiers: config.tiers.map(t => {
        if (t.id === tierId)
        {
          return {
            ...t,
            decorations: t.decorations.map(d => d.id === decoId ? { ...d, ...updates } : d)
          };
        }
        return t;
      })
    });
  };
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={dpr} onPointerMissed={() => setSelectedId(null)}>
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)}>
          <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={35} />
          <Suspense fallback={<Loader />}>
            <Bvh firstHitOnly>
              <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
                <CakeScene
                  config={config}
                  onUpdateDecoration={handleUpdateDecoration}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                />
              </Float>
            </Bvh>
            <Environment preset="apartment" environmentIntensity={0.8} />
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={2}
              castShadow
              shadow-mapSize={1024}
            />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={false}
            enabled={!isDragging}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={4}
            maxDistance={12}
          />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
