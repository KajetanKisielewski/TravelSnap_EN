import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";

interface TripStatsProps {
  trips: {
    destination: string;
    rating: number;
  }[];
}

export default function TripStats({ trips }: TripStatsProps) {
  const totalTrips = trips.length;
  const avgRating =
    totalTrips === 0
      ? 0
      : trips.reduce((sum, t) => sum + t.rating, 0) / totalTrips;
  const uniqueCountries = new Set(trips.map((t) => t.destination)).size;

  const stats = [
    { label: "Trips", value: totalTrips },
    { label: "Avg rating", value: avgRating.toFixed(1) },
    { label: "Countries", value: uniqueCountries },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.tile}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8, // space between tiles
    marginVertical: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  value: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
});