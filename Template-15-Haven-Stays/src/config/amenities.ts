import type { Amenity } from './types';

/** Amenity catalogue. Rooms reference these by id; `property: true` ones appear in the resort-wide section. */
export const amenities: Amenity[] = [
  { id: 'wifi', label: 'Fast Wi-Fi', icon: 'wifi' },
  { id: 'ac', label: 'Climate control', icon: 'snow' },
  { id: 'breakfast', label: 'Breakfast available', icon: 'coffee' },
  { id: 'balcony', label: 'Private terrace or balcony', icon: 'sun' },
  { id: 'seaview', label: 'Sea view', icon: 'wave' },
  { id: 'bathtub', label: 'Freestanding bath', icon: 'bath' },
  { id: 'plunge', label: 'Private plunge pool', icon: 'pool' },
  { id: 'kitchenette', label: 'Kitchenette', icon: 'cup' },
  { id: 'minibar', label: 'Curated minibar', icon: 'glass' },
  { id: 'workspace', label: 'Writing desk', icon: 'pen' },
  { id: 'espresso', label: 'Espresso machine', icon: 'coffee' },
  { id: 'fireplace', label: 'Wood-burning stove', icon: 'flame' },
  { id: 'accessible', label: 'Step-free access', icon: 'access' },
  { id: 'rainshower', label: 'Rain shower', icon: 'drop' },
  { id: 'butler', label: 'Butler on request', icon: 'bell' },
  { id: 'spa-access', label: 'Spa access included', icon: 'leaf' },
  { id: 'infinity-pool', label: 'Infinity pool', icon: 'pool', property: true, description: 'A 28-metre saltwater pool facing the cove, heated May to October.' },
  { id: 'spa', label: 'Spa & hammam', icon: 'leaf', property: true, description: 'Six treatment rooms, a stone hammam and a quiet garden relaxation terrace.' },
  { id: 'restaurant', label: 'Restaurants & bar', icon: 'glass', property: true, description: 'Two restaurants and a terrace bar built around the kitchen garden.' },
  { id: 'beach', label: 'Private cove', icon: 'wave', property: true, description: 'Sun loungers, kayaks and paddle boards at our shingle cove.' },
  { id: 'gym', label: 'Fitness studio', icon: 'dumbbell', property: true, description: 'Open-air studio with morning mobility and yoga classes.' },
  { id: 'kids', label: 'Family programme', icon: 'kite', property: true, description: 'Garden games, cooking workshops and supervised beach mornings in peak season.' },
  { id: 'concierge', label: '24-hour front desk', icon: 'bell', property: true, description: 'Excursions, transfers and restaurant bookings arranged for you.' },
  { id: 'ev', label: 'EV charging', icon: 'plug', property: true, description: 'Four charging bays in the lower car park.' },
];
