import { useMemo } from 'react';
import * as THREE from 'three';

export function useCenteredModel(scene: THREE.Group, options?: { yAlign?: 'center' | 'bottom' | 'top' }) {
  return useMemo(() => {
    // Compute bounding box from original scene
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Determine Y offset based on alignment
    let yOffset = -center.y;
    if (options?.yAlign === 'bottom') {
      yOffset = -box.min.y;
    } else if (options?.yAlign === 'top') {
      yOffset = -box.max.y;
    }

    const offset = new THREE.Vector3(-center.x, yOffset, -center.z);

    return { size, center, offset, box };
  }, [scene, options?.yAlign]);
}
