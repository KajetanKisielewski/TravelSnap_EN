import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Trip, TripData } from '@/types/trip';

interface TripsContextValue {
  trips: Trip[];
  addTrip: (trip: TripData) => Trip;
  deleteTrip: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'krk-2026',
    title: 'Trip to Warsaw',
    destination: 'Warsaw, Poland',
    date: '2026-03-15',
    rating: 5,
  },
  {
    id: 'Trip to London',
    title: 'Trip to London',
    destination: 'London, UK',
    date: '2026-02-01',
    rating: 4,
  },
  {
    id: 'Trip to Zakopane',
    title: 'Trip to Zakopane',
    destination: 'Zakopane, Poland',
    date: '2026-01-24',
    rating: 4.5,
  },
  {
    id: 'Trip to Croatia',
    title: 'Trip to Croatia',
    destination: 'Croatia',
    date: '2026-07-18',
    rating: 5,
  },
];

const TripsContext = createContext<TripsContextValue | undefined>(undefined);

export function TripsProvider({ children }: PropsWithChildren) {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);

  const value = useMemo<TripsContextValue>(
    () => ({
      trips,
      addTrip: (tripData) => {
        const trip: Trip = {
          id: Date.now().toString(),
          ...tripData,
        };

        setTrips((currentTrips) => [trip, ...currentTrips]);
        return trip;
      },
      deleteTrip: (id) => {
        setTrips((currentTrips) => currentTrips.filter((trip) => trip.id !== id));
      },
      getTripById: (id) => trips.find((trip) => trip.id === id),
    }),
    [trips]
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const context = useContext(TripsContext);

  if (!context) {
    throw new Error('useTrips must be used within a TripsProvider');
  }

  return context;
}
