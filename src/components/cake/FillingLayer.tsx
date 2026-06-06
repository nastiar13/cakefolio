import { useMemo } from 'react';
import * as THREE from 'three';
import { Clone } from '@react-three/drei';
import { useGLBAsset } from '../../hooks/useGLBAsset';
import { useCenteredModel } from '../../hooks/useCenteredModel';
import { ASSETS } from '../../assets';
import { dragStore } from '../../store/dragStore';

type Props = {
  radius: number;
  color: string;
};

export default function FillingLayer({ radius, color }: Props) {
  const { scene } = useGLBAsset(ASSETS.FILLING_LAYER);
  const { size, offset } = useCenteredModel(scene, { yAlign: 'center' });

  const scaleX = size.x === 0 ? 1 : (radius * 2) / size.x;
  const scaleY = size.y === 0 ? 1 : 0.1 / size.y;
  const scaleZ = size.z === 0 ? 1 : (radius * 2) / size.z;

  return (
    <group scale={[scaleX, scaleY, scaleZ]}>
      <Clone 
        object={scene} 
        position={offset} 
        castShadow
        inject={<meshStandardMaterial color={color} roughness={0.5} />}
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
