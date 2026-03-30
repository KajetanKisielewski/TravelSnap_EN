// components/RatingStars.tsx
import { Ionicons } from "@expo/vector-icons";
import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

export default function RatingStars({
  rating,
  maxStars = 5,
}: RatingStarsProps) {
  const normalizedRating = Math.max(0, Math.min(rating, maxStars));
  const stars: ReactElement[] = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= normalizedRating ? "star" : "star-outline"}
        size={16}
        color={Colors.accent}
        style={styles.star}
      />,
    );
  }

  return <View style={styles.row}>{stars}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 2,
  },
  star: {
    marginRight: 2,
  },
});
