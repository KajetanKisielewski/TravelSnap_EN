import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import type { Trip, TripData } from '@/types/trip';

interface TripContextValue {
  trips: Trip[];
  addTrip: (data: TripData) => void;
  deleteTrip: (id: string) => void;
}

const TripContext = createContext<TripContextValue | undefined>(undefined);

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({ children }: TripProviderProps) {
  const [trips, setTrips] = useState<Trip[]>([]);

  const addTrip = useCallback((data: TripData): void => {
    const newTrip: Trip = { id: Date.now().toString(), ...data };
    setTrips((prev) => [newTrip, ...prev]);
  }, []);

  const deleteTrip = useCallback((id: string): void => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  }, []);

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips(): TripContextValue {
  const value = useContext(TripContext);
  if (!value) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return value;
}
