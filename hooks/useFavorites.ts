import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@travelsnap_favorites';

interface UseFavorites {
  isLoading: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
}

export function useFavorites(): UseFavorites {
  const [favoriteTripIds, setFavoriteTripIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setFavoriteTripIds(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to load favorite trips from storage.', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFavorites();
  }, []);

  const isFavorite = (id: string): boolean => favoriteTripIds.includes(id);

  const toggleFavorite = async (id: string): Promise<void> => {
    const previousIds = favoriteTripIds;
    const nextIds = isFavorite(id)
      ? favoriteTripIds.filter((savedId) => savedId !== id)
      : [...favoriteTripIds, id];

    setFavoriteTripIds(nextIds);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
    } catch (error) {
      setFavoriteTripIds(previousIds);
      console.warn('Failed to save favorite trips to storage.', error);
    }
  };

  return { isLoading, isFavorite, toggleFavorite };
}
