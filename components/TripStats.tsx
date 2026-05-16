import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';

import type { Trip } from '@/types/trip';

interface TripStatsProps {
  trips: Trip[];
}

export default function TripStats({
  trips,
}: TripStatsProps) {
  const avgRating =
    trips.length > 0
      ? (
          trips.reduce(
            (sum, trip) => sum + trip.rating,
            0
          ) / trips.length
        ).toFixed(1)
      : '0.0';

  const countries = new Set(
    trips.map((trip) => trip.destination)
  ).size;

  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Text style={styles.number}>
          {trips.length}
        </Text>

        <Text style={styles.label}>
          Trips
        </Text>
      </View>

      <View style={styles.tile}>
        <Text style={styles.number}>
          {avgRating}
        </Text>

        <Text style={styles.label}>
          Avg rating
        </Text>
      </View>

      <View style={styles.tile}>
        <Text style={styles.number}>
          {countries}
        </Text>

        <Text style={styles.label}>
          Countries
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    gap: 8,

    marginBottom: 20,
  },

  tile: {
    flex: 1,

    backgroundColor: Colors.card,

    padding: 12,

    borderRadius: 16,

    alignItems: 'center',
  },

  number: {
    color: Colors.primary,

    fontSize: 24,

    fontWeight: 'bold',
  },

  label: {
    color: Colors.textSecondary,

    fontSize: 12,

    marginTop: 4,
  },
});