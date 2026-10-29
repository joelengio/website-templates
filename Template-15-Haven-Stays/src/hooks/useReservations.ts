import { useSyncExternalStore } from 'react';
import { reservationStore, subscribeReservations } from '../lib/reservations';

export function useReservations() {
  return useSyncExternalStore(subscribeReservations, () => reservationStore.list(), () => []);
}
