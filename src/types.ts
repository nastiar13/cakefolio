export type DecorationModelType = 'pearls' | 'sprinkles' | 'flower_rose' | 'macaron' | 'strawberry';

export type DecorationConfig = {
  id: string;
  type: DecorationModelType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
};

export type TopperType = 'none' | 'heart' | 'star' | 'number' | 'text';

export type TierConfig = {
  id: string;
  radius: number;
  height: number;
  flavorId: string;
  frostingId: string;
  frostingStyle: 'smooth' | 'textured' | 'naked';
  hasDrip: boolean;
  dripColor: string;
  decorations: DecorationConfig[];
};

export type Flavor = {
  id: string;
  name: string;
  color: string;
  hex: string;
};

export type CakeConfig = {
  tiers: TierConfig[];
  basePlateColor: string;
  topper: {
    type: TopperType;
    text?: string;
    color: string;
  };
  occasion: string;
  isPremium: boolean;
};
