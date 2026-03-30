// components/TripStats.tsx
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import type { Trip } from "@/types/trip";

interface TripStatsProps {
  trips: Trip[];
}

export default function TripStats({ trips }: TripStatsProps) {
  const count = trips.length;
  const avgRating =
    count > 0
      ? (trips.reduce((sum, t) => sum + t.rating, 0) / count).toFixed(1)
      : "—";
  const countries = new Set(trips.map((t) => t.destination)).size;

  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Text style={styles.value}>{count}</Text>
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
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
