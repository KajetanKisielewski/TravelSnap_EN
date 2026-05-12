import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { useTrips } from '@/contexts/TripContext';

const USER_NAME = 'Cem';
const COUNTRIES = 3;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileScreen() {
  const { trips } = useTrips();
  const count = trips.length;
  const avgRating =
    count === 0 ? '0.0' : (trips.reduce((sum, trip) => sum + trip.rating, 0) / count).toFixed(1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(USER_NAME)}</Text>
        </View>
        <Text style={styles.name}>{USER_NAME}</Text>
        <Text style={styles.joined}>Joined March 2026</Text>

        <View style={styles.statsRow}>
          <Stat value={String(count)} label="Trips" />
          <Stat value={String(COUNTRIES)} label="Countries" />
          <Stat value={avgRating} label="Rating" />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  joined: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
