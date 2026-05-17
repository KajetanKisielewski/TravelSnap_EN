import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/constants/Colors';

import {
    RESTCOUNTRIES_BASE_URL,
} from '@/constants/api';

import { useFetchAxios } from '@/hooks/useFetchAxios';

import type { Country } from '@/types/country';

interface CountryCardProps {
  countryName: string;
}

export default function CountryCard({
  countryName,
}: CountryCardProps) {
  const url =
    `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(
      countryName
    )}`;

  const {
    data,
    loading,
    error,
  } =
    useFetchAxios<
      Country[]
    >(url);

  if (loading) {
    return (
      <View
        style={
          styles.skeleton
        }
      />
    );
  }

  if (
    error ||
    !data?.[0]
  ) {
    return null;
  }

  const country =
    data[0];

  const currency =
    Object.values(
      country.currencies ??
        {}
    )[0];

  return (
    <View
      style={
        styles.card
      }
    >
      <Image
        source={{
          uri: country
            .flags.png,
        }}
        style={
          styles.flag
        }
      />

      <View
        style={
          styles.info
        }
      >
        <Text
          style={
            styles.name
          }
        >
          {
            country.name
              .common
          }
        </Text>

        <Text
          style={
            styles.meta
          }
        >
          Capital:{' '}
          {country
            .capital?.[0] ??
            '-'}
        </Text>

        <Text
          style={
            styles.meta
          }
        >
          Currency:{' '}
          {
            currency?.name
          }{' '}
          (
          {
            currency?.symbol
          }
          )
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    skeleton: {
      height: 120,

      backgroundColor:
        Colors.card,

      borderRadius: 16,

      marginTop: 16,
    },

    card: {
      flexDirection: 'row',

      backgroundColor:
        Colors.card,

      borderRadius: 16,

      padding: 16,

      marginTop: 16,
    },

    flag: {
      width: 60,

      height: 40,

      borderRadius: 8,
    },

    info: {
      flex: 1,

      marginLeft: 16,

      justifyContent:
        'center',
    },

    name: {
      fontSize: 16,

      fontWeight: 'bold',

      color:
        Colors.textPrimary,

      marginBottom: 6,
    },

    meta: {
      color:
        Colors.textSecondary,

      fontSize: 14,

      marginBottom: 2,
    },
  });