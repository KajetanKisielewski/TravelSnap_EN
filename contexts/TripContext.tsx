import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import type { Trip, TripData } from '@/types/trip';
import { deleteTripAssets } from '@/utils/imageStorage';

interface TripContextValue {
  trips: Trip[];
  addTrip: (data: TripData, id?: string) => Trip;
  deleteTrip: (id: string) => Promise<void>;
  addTripGalleryImage: (tripId: string, uri: string) => void;
  removeTripGalleryImage: (tripId: string, uri: string) => void;
  setTripMainImage: (tripId: string, uri?: string) => void;
}

const TripContext = createContext<TripContextValue | null>(null);

interface TripProviderProps {
  children: ReactNode;
}

export function TripProvider({ children }: TripProviderProps) {
  const [trips, setTrips] = useState<Trip[]>([]);

  const addTrip = (data: TripData, id?: string): Trip => {
    const newTrip: Trip = {
      id: id ?? Date.now().toString(),
      galleryUris: data.galleryUris ?? [],
      ...data,
    };
    setTrips((current) => [newTrip, ...current]);
    return newTrip;
  };

  const deleteTrip = async (id: string): Promise<void> => {
    setTrips((current) => current.filter((trip) => trip.id !== id));

    try {
      await deleteTripAssets(id);
    } catch (error) {
      console.warn(`Failed to delete stored assets for trip ${id}.`, error);
    }
  };

  const addTripGalleryImage = (tripId: string, uri: string): void => {
    setTrips((current) =>
      current.map((trip) =>
        trip.id === tripId
          ? { ...trip, galleryUris: [...(trip.galleryUris ?? []), uri] }
          : trip
      )
    );
  };

  const removeTripGalleryImage = (tripId: string, uri: string): void => {
    setTrips((current) =>
      current.map((trip) =>
        trip.id === tripId
          ? { ...trip, galleryUris: (trip.galleryUris ?? []).filter((item) => item !== uri) }
          : trip
      )
    );
  };

  const setTripMainImage = (tripId: string, uri?: string): void => {
    setTrips((current) =>
      current.map((trip) => (trip.id === tripId ? { ...trip, imageUri: uri } : trip))
    );
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        addTrip,
        deleteTrip,
        addTripGalleryImage,
        removeTripGalleryImage,
        setTripMainImage,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips(): TripContextValue {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
