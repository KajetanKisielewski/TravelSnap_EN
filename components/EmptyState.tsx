import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="airplane-outline" size={64} color={Colors.primary} />
      <Text style={styles.title}>No trips yet</Text>
      <Text style={styles.subtitle}>Add your first trip!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});