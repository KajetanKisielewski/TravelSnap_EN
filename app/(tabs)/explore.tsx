import {
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import DestinationCard from '@/components/DestinationCard';

import ErrorState from '@/components/ui/ErrorState';

import { Colors } from '@/constants/Colors';

const POPULAR = [
  'Tokyo',
  'Lisbon',
  'Reykjavik',
  'Bali',
  'Cape Town',
  'Kyoto',
  'Marrakech',
  'Patagonia',
];

const NETWORK_ERROR =
  false;

export default function ExploreScreen() {
  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const handleRetry =
    (): void => {
      setRefreshKey(
        (prev) =>
          prev + 1
      );
    };

  const handleRefresh =
    (): void => {
      setRefreshing(true);

      setRefreshKey(
        (prev) =>
          prev + 1
      );

      setTimeout(() => {
        setRefreshing(
          false
        );
      }, 1000);
    };

  if (NETWORK_ERROR) {
    return (
      <ErrorState
        message="Failed to load destinations"
        onRetry={
          handleRetry
        }
      />
    );
  }

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <FlatList
        key={refreshKey}
        data={POPULAR}
        keyExtractor={(
          city
        ) => city}
        renderItem={({
          item,
        }) => (
          <DestinationCard
            city={item}
          />
        )}
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor={
              Colors.primary
            }
          />
        }
      />
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,

      backgroundColor:
        Colors.background,
    },

    content: {
      padding: 16,
    },
  });