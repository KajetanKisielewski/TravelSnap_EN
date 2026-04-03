import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { useTrips } from '@/context/TripsContext';

export default function ProfileScreen() {
  const { trips } = useTrips();
  const tripCount = trips.length;
  const averageRating =
    tripCount > 0 ? (trips.reduce((sum, trip) => sum + trip.rating, 0) / tripCount).toFixed(1) : '0.0';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Profile</Text>

      <View style={styles.avatar}>
        <Text style={styles.initials}>AS</Text>
      </View>

      <Text style={styles.name}>Anna</Text>
      <Text style={styles.joined}>Joined April 2026</Text>

      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.value}>{tripCount}</Text>
          <Text style={styles.label}>Trips</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.value}>4</Text>
          <Text style={styles.label}>Countries</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.value}>{averageRating}</Text>
          <Text style={styles.label}>Rating</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  screenTitle: {
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.background,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  joined: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
    width: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
