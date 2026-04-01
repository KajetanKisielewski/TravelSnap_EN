import { Colors } from "@/constants/Colors";
import type { TripData } from "@/types/trip";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RatingStars from "./RatingStars";

export interface TripCardProps extends TripData {
  onDelete?: () => void;
}

export default function TripCard({
  title,
  destination,
  date,
  rating,
  onDelete,
}: TripCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="location" size={20} color="#E94560" />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.destination}>{destination}</Text>
        </View>
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>X</Text>
          </Pressable>
        )}
      </View>

      {/* Date */}
      <View style={styles.dateRow}>
        <Ionicons name="calendar" size={14} color="#61DAFB" />
        <Text style={styles.dateText}>{date}</Text>
      </View>

      {/* Stars */}
      <RatingStars rating={rating} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    //ios shadow
    shadowColor: "#000",
    // shadowOffcet: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    //android shadow
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  destination: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 13,
  },
  meta: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});
