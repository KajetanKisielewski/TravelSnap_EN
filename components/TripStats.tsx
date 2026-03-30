import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface Trip {
  id: string;
  title: string;
  destination: string;
  date: string;
  rating: number;
}

interface TripStatsProps {
  trips: Trip[];
}

export default function TripStats({ trips }: TripStatsProps) {
  const tripCount = trips.length;

  const avgRating =
    tripCount === 0
      ? '0.0'
      : (
          trips.reduce((sum, trip) => sum + trip.rating, 0) / tripCount
        ).toFixed(1);

  const countries = new Set(trips.map((trip) => trip.destination)).size;

  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Text style={styles.value}>{tripCount}</Text>
        <Text style={styles.label}>Trips</Text>
      </View>

      <View style={styles.tile}>
        <Text style={styles.value}>{avgRating}</Text>
        <Text style={styles.label}>Avg rating</Text>
      </View>

      <View style={styles.tile}>
        <Text style={styles.value}>{countries}</Text>
        <Text style={styles.label}>Countries</Text>
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

  tile: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
  },

  value: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});