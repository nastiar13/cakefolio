import { useGLTF } from '@react-three/drei';
import { ASSETS } from '../assets';

// Use standard Draco decoder
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

/**
 * Custom hook to load GLB assets with Draco support and caching.
 * Optimized for large files by loading them lazily rather than eagerly.
 */
export function useGLBAsset(path: string) {
  return useGLTF(path, DRACO_DECODER_PATH);
}

// Only preload the absolute essentials (like the cake board and base tier)
// to prevent massive memory spikes or bandwidth freezing on initial load.
useGLTF.preload(ASSETS.CAKE_BOARD, DRACO_DECODER_PATH);
useGLTF.preload(ASSETS.TIER_ROUND, DRACO_DECODER_PATH);
