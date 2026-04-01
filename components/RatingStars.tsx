import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

export default function RatingStars({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={"#E94560"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stars: {
    flexDirection: "row",
    marginTop: 2,
  },
  star: {
    fontSize: 16,
    color: Colors.accent,
    marginRight: 2,
  },
});
