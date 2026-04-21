// context/TripContext.tsx
import { Trip, TripData } from '@/types/trip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface TripContextValue {
  trips: Trip[];
  addTrip: (data: TripData) => void;
  updateTrip: (id: string, data: Partial<TripData>) => void;
}

const TripContext = createContext<TripContextValue | null>(null);
const STORAGE_KEY = 'trips';

const SAMPLE_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    date: '2025-03-15',
    rating: 5,
  },
  {
    id: '2',
    title: 'Paris Getaway',
    destination: 'Paris, France',
    date: '2024-11-10',
    rating: 4,
  },
];

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        setTrips(JSON.parse(raw));
      } else {
        setTrips(SAMPLE_TRIPS);
      }
    });
  }, []);

  useEffect(() => {
    if (trips.length > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    }
  }, [trips]);

  const addTrip = (data: TripData) => {
    const newTrip: Trip = {
      ...data,
      id: Date.now().toString(),
    };
    setTrips((prev) => [newTrip, ...prev]);
  };

  const updateTrip = (id: string, data: Partial<TripData>) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, updateTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used within TripProvider');
  return ctx;
}