// app/(tabs)/profile.tsx
import { useTripContext } from '@/context/TripContext';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { trips } = useTripContext();

  const tripCount = trips.length;
  const avgRating =
    tripCount > 0
      ? (trips.reduce((sum, t) => sum + t.rating, 0) / tripCount).toFixed(1)
      : '0.0';
  const countriesCount = 12;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.initials}>EA</Text>
      </View>

      <Text style={styles.name}>Emre Arac</Text>
      <Text style={styles.joinDate}>Joined March 2026</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tripCount}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{countriesCount}</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgRating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  content: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: '#61DAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0A1628',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#8B95A5',
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A2744',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#61DAFB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B95A5',
  },
});