import * as THREE from 'three';

export type DragState = {
  tierId: string | null;
  decoId: string | null;
  isDragging: boolean;
};

const state: DragState = {
  tierId: null,
  decoId: null,
  isDragging: false,
};

type Listener = (state: DragState, point?: THREE.Vector3) => void;
const listeners = new Set<Listener>();

export const dragStore = {
  getState: () => state,
  setDrag: (tierId: string | null, decoId: string | null, isDragging: boolean) => {
    state.tierId = tierId;
    state.decoId = decoId;
    state.isDragging = isDragging;
    listeners.forEach(l => l(state));
  },
  move: (point: THREE.Vector3) => {
    if (state.isDragging) {
      listeners.forEach(l => l(state, point));
    }
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }
};
