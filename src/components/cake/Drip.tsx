import { useMemo } from 'react';
import * as THREE from 'three';
import { Clone } from '@react-three/drei';
import { useGLBAsset } from '../../hooks/useGLBAsset';
import { useCenteredModel } from '../../hooks/useCenteredModel';
import { ASSETS } from '../../assets';
import { dragStore } from '../../store/dragStore';

type Props = {
  radius: number;
  height: number;
  color: string;
};

export default function Drip({ radius, height, color }: Props) {
  const { scene } = useGLBAsset(ASSETS.DRIP_CHOCOLATE);
  const { size, offset } = useCenteredModel(scene, { yAlign: 'top' });

  const targetRadius = radius * 1.02;
  const scale = size.x === 0 ? 1 : (targetRadius * 2) / size.x;

  return (
    <group position={[0, height / 2, 0]} scale={[scale, scale, scale]}>
      <Clone 
        object={scene} 
        position={offset} 
        castShadow
        inject={<meshStandardMaterial color={color} roughness={0.1} metalness={0.05} />}
        onPointerMove={(e: any) => {
          const state = dragStore.getState();
          if (state.isDragging) {
            e.stopPropagation();
            dragStore.move(e.point);
          }
        }}
      />
    </group>
  );
}
