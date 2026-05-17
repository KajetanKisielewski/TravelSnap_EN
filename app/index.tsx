import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import TripCard from '@/components/TripCard';

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <TripCard
          title="Paris Trip"
          destination="France"
          date="2026-03-10"
          rating={5}
        />

        <TripCard
          title="Tokyo Adventure"
          destination="Japan"
          date="2026-04-12"
          rating={4}
        />

        <TripCard
          title="Beach Holiday"
          destination="Spain"
          date="2026-06-20"
          rating={3}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      padding: 16,
    },
  });