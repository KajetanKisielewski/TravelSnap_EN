import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'travelsnap:favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

        if (!isMounted) {
          return;
        }

        setFavoriteIds(storedFavorites ? JSON.parse(storedFavorites) : []);
      } catch {
        if (isMounted) {
          setFavoriteIds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistFavorites = useCallback(async (nextFavorites: string[]) => {
    setFavoriteIds(nextFavorites);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  }, []);

  const toggleFavorite = useCallback(
    async (tripId: string) => {
      const nextFavorites = favoriteIds.includes(tripId)
        ? favoriteIds.filter((id) => id !== tripId)
        : [...favoriteIds, tripId];

      await persistFavorites(nextFavorites);
    },
    [favoriteIds, persistFavorites]
  );

  const isFavorite = useCallback(
    (tripId: string) => favoriteIds.includes(tripId),
    [favoriteIds]
  );

  return {
    favoriteIds,
    isFavorite,
    isLoading,
    toggleFavorite,
  };
}
