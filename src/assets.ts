export const ASSETS = {
  CAKE_BOARD: '/assets/cake_board.glb',
  COATING_BUTTERCREAM: '/assets/coating_buttercream.glb',
  DRIP_CHOCOLATE: '/assets/drip_chocolate.glb',
  FILLING_LAYER: '/assets/filling_layer.glb',
  FLOWER_ROSE: '/assets/flower_rose.glb',
  MACARON: '/assets/macaron.glb',
  STRAWBERRY: '/assets/strawberry3.glb',
  TIER_ROUND: '/assets/tier_round.glb',
} as const;

export type AssetKey = keyof typeof ASSETS;
