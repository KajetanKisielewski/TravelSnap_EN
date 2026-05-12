import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Trip } from '@/types/trip';

const STORAGE_KEY = 'travelsnap_trips';

export async function saveTrips(trips: Trip[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.warn('Failed to save trips to storage.', error);
  }
}

export async function loadTrips(): Promise<Trip[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Trip[];
  } catch (error) {
    console.warn('Failed to load trips from storage.', error);
    return [];
  }
}
