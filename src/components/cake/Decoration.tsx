import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Clone } from '@react-three/drei';
import { useGLBAsset } from '../../hooks/useGLBAsset';
import { useCenteredModel } from '../../hooks/useCenteredModel';
import { ASSETS, AssetKey } from '../../assets';
import { DecorationConfig } from '../../types';
import { dragStore } from '../../store/dragStore';

type Props = {
  tierId: string;
  config: DecorationConfig;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange?: (updates: Partial<DecorationConfig>) => void;
};

const TYPE_TO_ASSET: Record<string, AssetKey> = {
  'flower_rose': 'FLOWER_ROSE',
  'macaron': 'MACARON',
  'strawberry': 'STRAWBERRY',
};

export default function Decoration({ tierId, config, isSelected, onSelect, onChange }: Props) {
  const assetKey = TYPE_TO_ASSET[config.type];
  const { scene } = useGLBAsset(ASSETS[assetKey] || ASSETS.FLOWER_ROSE);
  const { size, offset } = useCenteredModel(scene, { yAlign: 'bottom' });
  const groupRef = useRef<THREE.Group>(null);

  // Handle Drag Move Subscription
  useEffect(() => {
    return dragStore.subscribe((state, point) => {
      if (state.isDragging && state.decoId === config.id && point && groupRef.current) {
        if (groupRef.current.parent) {
           const localPoint = groupRef.current.parent.worldToLocal(point.clone());
           groupRef.current.position.copy(localPoint);
        }
      }
    });
  }, [config.id]);

  // Handle Drag End
  useEffect(() => {
    const handlePointerUp = () => {
      const state = dragStore.getState();
      if (state.isDragging && state.decoId === config.id) {
         dragStore.setDrag(null, null, false);
         if (groupRef.current && onChange) {
            const pos = groupRef.current.position;
            onChange({ position: [pos.x, pos.y, pos.z] });
         }
      }
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, [config.id, onChange]);

  const maxDim = Math.max(size.x, size.y, size.z);
  const targetSize = 0.3;
  const baseScale = maxDim === 0 ? 1 : targetSize / maxDim;
  const finalScale: [number, number, number] = [
    config.scale[0] * baseScale,
    config.scale[1] * baseScale,
    config.scale[2] * baseScale
  ];

  return (
    <group 
      ref={groupRef}
      position={config.position} 
      rotation={config.rotation} 
      scale={finalScale}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect();
        dragStore.setDrag(tierId, config.id, true);
        (e.target as any).setPointerCapture(e.pointerId);
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'auto';
      }}
    >
      <group position={offset}>
        <Clone 
          object={scene} 
          castShadow 
          receiveShadow 
          inject={config.color ? <meshStandardMaterial color={config.color} /> : undefined}
        />
      </group>
      
      {/* Highlight ring when selected */}
      {isSelected && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial color="#ff6b95" side={THREE.DoubleSide} transparent opacity={0.8} depthTest={false} />
        </mesh>
      )}
    </group>
  );
}
