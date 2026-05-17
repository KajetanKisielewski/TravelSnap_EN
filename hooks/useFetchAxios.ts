import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

interface FetchState<T> {
  data: T | null;

  loading: boolean;

  error: string | null;

  refetch: () => void;
}

export function useFetchAxios<T>(
  url: string
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
      async (): Promise<void> => {
        try {
          setLoading(true);

          setError(null);

          const response =
            await axios.get<T>(
              url
            );

          setData(
            response.data
          );
        } catch (err) {
          setError(
            String(err)
          );
        } finally {
          setLoading(false);
        }
      },

      [url]
    );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch:
      fetchData,
  };
}