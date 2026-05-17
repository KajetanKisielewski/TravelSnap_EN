import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface FetchState<T> {
  data: T | null;

  loading: boolean;

  error: string | null;

  refetch: () => void;
}

interface CacheEntry<T> {
  ts: number;

  data: T;
}

const CACHE_MAX_AGE =
  1000 *
  60 *
  60 *
  24;

export function useFetch<T>(
  url: string,

  init?: RequestInit
): FetchState<T> {
  const [data, setData] =
    useState<T | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const fetchData =
    useCallback(
      async (
        cancelled = false
      ): Promise<void> => {
        const cacheKey =
          `cache:v1:${url}`;

        try {
          setError(null);

          const cached =
            await AsyncStorage.getItem(
              cacheKey
            );

          if (
            cancelled
          ) {
            return;
          }

          if (cached) {
            const parsed =
              JSON.parse(
                cached
              ) as CacheEntry<T>;

            const isFresh =
              Date.now() -
                parsed.ts <
              CACHE_MAX_AGE;

            if (isFresh) {
              setData(
                parsed.data
              );

              setLoading(
                false
              );
            }
          }

          const response =
            await fetch(
              url,
              init
            );

          if (
            cancelled
          ) {
            return;
          }

          if (
            !response.ok
          ) {
            throw new Error(
              `HTTP ${response.status}`
            );
          }

          const json =
            (await response.json()) as T;

          if (
            cancelled
          ) {
            return;
          }

          setData(json);

          await AsyncStorage.setItem(
            cacheKey,

            JSON.stringify({
              ts: Date.now(),

              data: json,
            })
          );
        } catch (err) {
          if (
            cancelled
          ) {
            return;
          }

          setError(
            String(err)
          );
        } finally {
          if (
            cancelled
          ) {
            return;
          }

          setLoading(false);
        }
      },

      [url]
    );

  useEffect(() => {
    let cancelled =
      false;

    void fetchData(
      cancelled
    );

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch:
      () =>
        void fetchData(),
  };
}