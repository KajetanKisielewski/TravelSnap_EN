import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTrips } from '@/contexts/TripContext';
import { Colors } from '@/constants/Colors';

const PROFILE = {
  name: 'Kajetan Kisielewski',
  initials: 'KK',
  joinDate: 'March 2026',
} as const;

interface StatItem {
  label: string;
  value: string | number;
}

export default function ProfileScreen() {
  const { trips } = useTrips();

  const stats = useMemo(() => {
    const count = trips.length;
    const avg =
      count > 0
        ? (trips.reduce((sum, trip) => sum + trip.rating, 0) / count).toFixed(1)
        : '0.0';  
    const countries = new Set(trips.map((trip) => trip.destination)).size;

    return { count, avg, countries };
  }, [trips]);

  const statItems: StatItem[] = [
    { label: 'Trips', value: stats.count },
    { label: 'Countries', value: stats.countries },
    { label: 'Rating', value: stats.avg },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{PROFILE.initials}</Text>
        </View>

        <Text style={styles.name}>{PROFILE.name}</Text>
        <Text style={styles.joinDate}>Joined {PROFILE.joinDate}</Text>

        <View style={styles.statsRow}>
          {statItems.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
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
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 9999,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.background,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  joinDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
