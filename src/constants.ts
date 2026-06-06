import { Flavor, CakeConfig } from './types';

export const SPONGE_FLAVORS: Flavor[] = [
  { id: 'vanilla', name: 'Vanilla', color: '#F3E5AB', hex: '#F3E5AB' },
  { id: 'chocolate', name: 'Chocolate', color: '#3D1C02', hex: '#3D1C02' },
  { id: 'red-velvet', name: 'Red Velvet', color: '#7E0F12', hex: '#7E0F12' },
  { id: 'lemon', name: 'Lemon', color: '#FFF44F', hex: '#FFF44F' },
  { id: 'strawberry', name: 'Strawberry', color: '#98BF64', hex: '#98BF64' },
];

export const FROSTING_FLAVORS: Flavor[] = [
  { id: 'buttercream', name: 'Buttercream', color: '#FFFDD0', hex: '#FFFDD0' },
  { id: 'ganache', name: 'Dark Ganache', color: '#1B0D05', hex: '#1B0D05' },
  { id: 'cream-cheese', name: 'Cream Cheese', color: '#FFFFFF', hex: '#FFFFFF' },
  { id: 'matcha', name: 'Matcha', color: '#98BF64', hex: '#98BF64' },
  { id: 'lavender', name: 'Lavender', color: '#E6E6FA', hex: '#E6E6FA' },
];

export const INITIAL_CAKE: CakeConfig = {
  tiers: [
    {
      id: 'tier-1',
      radius: 1.5,
      height: 0.8,
      flavorId: 'vanilla',
      frostingId: 'buttercream',
      frostingStyle: 'smooth',
      hasDrip: false,
      dripColor: '#3D1C02',
      decorations: [],
    },
    {
      id: 'tier-2',
      radius: 1,
      height: 0.7,
      flavorId: 'red-velvet',
      frostingId: 'cream-cheese',
      frostingStyle: 'smooth',
      hasDrip: true,
      dripColor: '#7E0F12',
      decorations: [],
    }
  ],
  topper: {
    type: 'none',
    text: '',
    color: '#ff6b95',
  },
  basePlateColor: '#E2E8F0',
  occasion: 'Wedding Anniversary',
  isPremium: true,
};
