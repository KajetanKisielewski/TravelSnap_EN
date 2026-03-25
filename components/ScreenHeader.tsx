import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

interface ScreenHeaderProps {
  tripCount: number;
}

export default function ScreenHeader({ tripCount }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>TravelSnap</Text>
        <Text style={styles.subtitle}>Your travel journal</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{tripCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});