import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Trip } from '@/types/trip';

const STORAGE_KEY =
  'travelsnap_trips';

export async function saveTrips(
  trips: Trip[]
): Promise<void> {
  try {
    const json =
      JSON.stringify(trips);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      json
    );
  } catch (error) {
    console.error(
      'Failed to save trips:',
      error
    );
  }
}

export async function loadTrips(): Promise<
  Trip[]
> {
  try {
    const json =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );

    if (!json) {
      return [];
    }

    return JSON.parse(json);
  } catch (error) {
    console.error(
      'Failed to load trips:',
      error
    );

    return [];
  }
}