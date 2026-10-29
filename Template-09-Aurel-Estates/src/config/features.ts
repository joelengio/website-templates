import type { FeatureKey } from './types';

/** Feature catalogue — labels used in filters and on property pages. */
export const featureLabels: Record<FeatureKey, string> = {
  pool: 'Swimming pool',
  garden: 'Private garden',
  garage: 'Garage',
  waterview: 'Water views',
  fireplace: 'Fireplace',
  'smart-home': 'Smart home',
  'guest-house': 'Guest house',
  'wine-cellar': 'Wine cellar',
  solar: 'Solar power',
  'home-office': 'Home office',
  terrace: 'Terrace',
  gym: 'Gym',
};

/** Price steps offered in the "Price" filters (in site currency). */
export const priceSteps = [500000, 1000000, 1500000, 2000000, 3000000, 4000000, 5000000, 7000000];
