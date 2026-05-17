import {
    RESTCOUNTRIES_BASE_URL,
} from '@/constants/api';

import { useFetch } from './useFetch';

import type { Country } from '@/types/country';

export function useCountry(
  countryName: string
) {
  const url =
    `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(
      countryName
    )}?fields=name,flags,region,population`;

  return useFetch<
    Country[]
  >(url);
}