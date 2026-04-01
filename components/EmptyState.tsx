import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function EmptyState() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="airplane-outline" size={64} color={Colors.primary} />
      <Text style={styles.textPrimary}> No trips yet</Text>
      <Text style={styles.textSecondary}> Add your first trip!</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  textPrimary: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.accent,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textSecondary,
  },
});
