import { Colors } from "@/constants/Colors";
import type { Trip } from "@/types/trip";
import { StyleSheet, Text, View } from "react-native";

interface TripStatsProps {
  trips: Trip[];
}

export default function TripStats({ trips }: TripStatsProps) {
  const tripCount = trips.length;
  const avgRating =
    tripCount === 0
      ? 0
      : (trips.reduce((sum, trip) => sum + trip.rating, 0) / tripCount).toFixed(
          1
        );
  const countries = new Set(trips.map((trip) => trip.destination)).size;
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Text style={styles.tileText}>Trips</Text>
        <Text style={styles.tileText}>{tripCount}</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.tileText}>Average Rating</Text>
        <Text style={styles.tileText}>{avgRating}</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.tileText}>Destinations</Text>
        <Text style={styles.tileText}>{countries}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  tile: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  tileText: {
    color: Colors.textPrimary,
  },
});
