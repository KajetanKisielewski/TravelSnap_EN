import {
  createContext,
  useContext,
  useState,
} from 'react';

import type {
  ReactNode,
} from 'react';

import type {
  Trip,
  TripData,
} from '@/types/trip';

interface TripContextValue {
  trips: Trip[];

  addTrip: (
    data: TripData
  ) => void;

  deleteTrip: (
    id: string
  ) => void;

  addGalleryPhoto: (
    tripId: string,
    uri: string
  ) => void;

  removeGalleryPhoto: (
    tripId: string,
    uri: string
  ) => void;
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

  const addTrip = (
    data: TripData
  ): void => {
    const newTrip: Trip = {
      id: Date.now().toString(),

      ...data,

      galleryUris:
        data.galleryUris ?? [],
    };

    setTrips((current) => [
      newTrip,
      ...current,
    ]);
  };

  const deleteTrip = (
    id: string
  ): void => {
    setTrips((current) =>
      current.filter(
        (trip) =>
          trip.id !== id
      )
    );
  };

 const addGalleryPhoto = (
  tripId: string,
  uri: string
): void => {
  setTrips((current) =>
    current.map((trip) => {
      if (
        trip.id !== tripId
      ) {
        return trip;
      }

      const updatedGallery = [
        ...(trip.galleryUris ??
          []),

        uri,
      ];

      return {
        ...trip,

        galleryUris:
          updatedGallery,

        imageUri:
          trip.imageUri ??
          updatedGallery[0],
      };
    })
  );
};

 const removeGalleryPhoto = (
  tripId: string,
  uri: string
): void => {
  setTrips((current) =>
    current.map((trip) => {
      if (
        trip.id !== tripId
      ) {
        return trip;
      }

      const updatedGallery =
        trip.galleryUris?.filter(
          (item) =>
            item !== uri
        ) ?? [];

      return {
        ...trip,

        galleryUris:
          updatedGallery,

        imageUri:
          trip.imageUri ===
          uri
            ? updatedGallery[0]
            : trip.imageUri,
      };
    })
  );
};

  return (
    <TripContext.Provider
      value={{
        trips,

        addTrip,

        deleteTrip,

        addGalleryPhoto,

        removeGalleryPhoto,
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