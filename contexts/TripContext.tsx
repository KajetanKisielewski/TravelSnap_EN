import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from 'react';

import type { Trip, TripData } from '@/types/trip';

interface TripContextType {
  trips: Trip[];

  addTrip: (trip: TripData) => void;

  deleteTrip: (id: string) => void;
}

const TripContext =
  createContext<TripContextType | null>(null);

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({
  children,
}: TripProviderProps) {
  const [trips, setTrips] = useState<Trip[]>([]);

  const addTrip = (trip: TripData) => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      ...trip,
    };

    setTrips((prev) => [newTrip, ...prev]);
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) =>
      prev.filter((trip) => trip.id !== id)
    );
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        addTrip,
        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);

  if (!context) {
    throw new Error(
      'useTrips must be used inside TripProvider'
    );
  }

  return context;
}