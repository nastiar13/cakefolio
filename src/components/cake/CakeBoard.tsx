import { useMemo } from 'react';
import * as THREE from 'three';
import { Clone } from '@react-three/drei';
import { useGLBAsset } from '../../hooks/useGLBAsset';
import { useCenteredModel } from '../../hooks/useCenteredModel';
import { ASSETS } from '../../assets';
import { dragStore } from '../../store/dragStore';

type Props = {
  color: string;
};

export default function CakeBoard({ color }: Props) {
  const { scene } = useGLBAsset(ASSETS.CAKE_BOARD);
  const { size, offset } = useCenteredModel(scene, { yAlign: 'top' });

  const targetRadius = 2.8;
  const targetHeight = 0.1;
  const scaleX = size.x === 0 ? 1 : (targetRadius * 2) / size.x;
  const scaleY = size.y === 0 ? 1 : targetHeight / size.y;
  const scaleZ = size.z === 0 ? 1 : (targetRadius * 2) / size.z;

  return (
    <group position={[0, 0, 0]} scale={[scaleX, scaleY, scaleZ]}>
      <Clone 
        object={scene} 
        position={offset} 
        castShadow
        receiveShadow
        inject={<meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />}
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
