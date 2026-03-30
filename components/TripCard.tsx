// /components/TripCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

export interface TripCardProps {
  title: string;
  destination: string;
  date: string;
  rating: number;
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
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {destination} | {date}
        </Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= rating ? "star" : "star-outline"}
              size={16}
              color={Colors.accent}
            />
          ))}
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash" size={16} color={Colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  info: { flex: 1 },
  title: { color: Colors.textPrimary, fontSize: 18, fontWeight: "bold" },
  meta: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  stars: { flexDirection: "row", marginTop: 6 },
  deleteButton: {
    backgroundColor: "rgba(233,69,96,0.15)",
    borderRadius: 12,
    padding: 6,
    marginLeft: 12,
  },
});