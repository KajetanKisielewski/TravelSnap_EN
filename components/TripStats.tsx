import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import type { Trip } from '@/types/trip';

interface TripStatsProps {
  trips: Trip[];
}

export default function TripStats({ trips }: TripStatsProps) {
  const total = trips.length;
  const avgRating =
    total === 0
      ? '0.0'
      : (trips.reduce((sum, trip) => sum + trip.rating, 0) / total).toFixed(1);
  const countries = new Set(trips.map((trip) => trip.destination)).size;

  return (
    <View style={styles.row}>
      <Tile value={String(total)} label="Trips" />
      <Tile value={avgRating} label="Avg rating" />
      <Tile value={String(countries)} label="Countries" />
    </View>
  );
}

interface TileProps {
  value: string;
  label: string;
}

function Tile({ value, label }: TileProps) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  value: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
