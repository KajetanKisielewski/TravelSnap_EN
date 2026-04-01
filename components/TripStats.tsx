import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import type { Trip } from '@/types/trip';

interface Props {
  trips: Trip[];
}

export default function TripStats({ trips }: Props) {
  const avgRating =
    trips.length === 0
      ? 0
      : trips.reduce((sum, t) => sum + t.rating, 0) / trips.length;

  const countries = new Set(trips.map((t) => t.destination)).size;

  return (
    <View style={styles.container}>
      <Stat title="Trips" value={trips.length.toString()} />
      <Stat title="Avg rating" value={avgRating.toFixed(1)} />
      <Stat title="Countries" value={countries.toString()} />
    </View>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{title}</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});