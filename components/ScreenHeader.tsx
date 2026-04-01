import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

interface ScreenHeaderProps {
  tripCount: number;
}

export default function ScreenHeader({ tripCount }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>TravelSnap</Text>
        <Text style={styles.subTitle}>Your travel journal</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{tripCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
});
