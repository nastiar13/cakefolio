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
  style: 'smooth' | 'textured' | 'naked';
};

export default function Coating({ radius, height, color, style }: Props) {
  const { scene } = useGLBAsset(ASSETS.COATING_BUTTERCREAM);
  const { size, offset } = useCenteredModel(scene, { yAlign: 'center' });

  const targetRadius = radius * 1.02;
  const scaleX = size.x === 0 ? 1 : (targetRadius * 2) / size.x;
  const scaleY = size.y === 0 ? 1 : height / size.y;
  const scaleZ = size.z === 0 ? 1 : (targetRadius * 2) / size.z;

  return (
    <group scale={[scaleX, scaleY, scaleZ]}>
      <Clone 
        object={scene} 
        position={offset} 
        castShadow
        receiveShadow
        inject={
          <meshStandardMaterial 
            color={color} 
            roughness={style === 'textured' ? 0.9 : 0.4} 
            metalness={0.02} 
            transparent={style === 'naked'}
            opacity={style === 'naked' ? 0.4 : 1}
          />
        }
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
