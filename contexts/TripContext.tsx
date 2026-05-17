import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type {
  ReactNode,
} from 'react';

import type {
  Trip,
  TripData,
} from '@/types/trip';

import {
  loadTrips,
  saveTrips,
} from '@/utils/tripStorage';

interface TripContextValue {
  trips: Trip[];

  loading: boolean;

  addTrip: (
    data: TripData
  ) => Promise<void>;

  updateTrip: (
    id: string,
    patch: Partial<TripData>
  ) => Promise<void>;

  deleteTrip: (
    id: string
  ) => Promise<void>;
}

const TripContext =
  createContext<TripContextValue | null>(
    null
  );

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({
  children,
}: TripProviderProps) {
  const [trips, setTrips] =
    useState<Trip[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const initialize =
      async (): Promise<void> => {
        const storedTrips =
          await loadTrips();

        setTrips(storedTrips);

        setLoading(false);
      };

    initialize();
  }, []);

  const addTrip =
    async (
      data: TripData
    ): Promise<void> => {
      const newTrip: Trip = {
        id: Date.now().toString(),

        ...data,
      };

      const updated = [
        newTrip,
        ...trips,
      ];

      setTrips(updated);

      await saveTrips(
        updated
      );
    };

  const updateTrip =
    async (
      id: string,
      patch: Partial<TripData>
    ): Promise<void> => {
      const updated =
        trips.map((trip) =>
          trip.id === id
            ? {
                ...trip,
                ...patch,
              }
            : trip
        );

      setTrips(updated);

      await saveTrips(
        updated
      );
    };

  const deleteTrip =
    async (
      id: string
    ): Promise<void> => {
      const updated =
        trips.filter(
          (trip) =>
            trip.id !== id
        );

      setTrips(updated);

      await saveTrips(
        updated
      );
    };

  return (
    <TripContext.Provider
      value={{
        trips,

        loading,

        addTrip,

        updateTrip,

        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips(): TripContextValue {
  const context =
    useContext(
      TripContext
    );

  if (!context) {
    throw new Error(
      'useTrips must be used within a TripProvider'
    );
  }

  return context;
}