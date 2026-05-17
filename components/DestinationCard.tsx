import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    UNSPLASH_ACCESS_KEY,
    UNSPLASH_BASE_URL,
} from '@/constants/api';

import { useFetch } from '@/hooks/useFetch';

import type { UnsplashResponse } from '@/types/unsplash';

import { Colors } from '@/constants/Colors';

interface DestinationCardProps {
  city: string;
}

export default function DestinationCard({
  city,
}: DestinationCardProps) {
  const url =
    `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
      city
    )}&per_page=1`;

  const {
    data,
    loading,
    error,
  } =
    useFetch<UnsplashResponse>(
      url,

      {
        headers: {
          Authorization:
            `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

  if (loading) {
    return (
      <View
        style={
          styles.skeleton
        }
      >
        <ActivityIndicator
          size="large"
          color={
            Colors.primary
          }
        />
      </View>
    );
  }

  if (
    error ||
    !data?.results?.[0]
  ) {
    return null;
  }

  const imageUri =
    data.results[0]
      .urls.regular;

  return (
    <Pressable
      style={
        styles.card
      }
    >
      <Image
        source={{
          uri: imageUri,
        }}
        style={
          styles.image
        }
      />

      <View
        style={
          styles.overlay
        }
      >
        <Text
          style={
            styles.city
          }
        >
          {city}
        </Text>
      </View>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    skeleton: {
      height: 220,

      borderRadius: 16,

      backgroundColor:
        Colors.card,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 16,
    },

    card: {
      borderRadius: 16,

      overflow: 'hidden',

      marginBottom: 16,
    },

    image: {
      width: '100%',

      height: 220,
    },

    overlay: {
      position: 'absolute',

      left: 0,

      right: 0,

      bottom: 0,

      backgroundColor:
        'rgba(0,0,0,0.45)',

      padding: 16,
    },

    city: {
      color: 'white',

      fontSize: 22,

      fontWeight: 'bold',
    },
  });