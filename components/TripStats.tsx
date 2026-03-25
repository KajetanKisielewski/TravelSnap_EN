import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import type { Trip } from '@/types/trip';

interface TripStatsProps {
  trips: Trip[];
}

export default function TripStats({ trips }: TripStatsProps) {
  const count = trips.length;

  const totalRating = trips.reduce((sum, trip) => sum + trip.rating, 0);
  const avgRating = count > 0 ? (totalRating / count).toFixed(1) : '0.0';

  const uniqueDestinations = new Set(trips.map(trip => trip.destination)).size;

  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{count}</Text>
        <Text style={styles.statLabel}>Podróże</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{avgRating}</Text>
        <Text style={styles.statLabel}>Śr. ocena</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{uniqueDestinations}</Text>
        <Text style={styles.statLabel}>Miejsca</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
