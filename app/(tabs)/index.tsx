import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Link } from 'expo-router';

import AddTripForm from '../../components/AddTripForm';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import TripCard from '../../components/TripCard';
import TripStats from '../../components/TripStats';

import { useTrips } from '../../context/TripContext';

import { Colors } from '../../constants/Colors';

export default function HomeScreen() {
  const {
    trips,
    addTrip,
    loading,
    deleteTrip,
  } = useTrips();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        style={styles.container}
        // REVIEW: ScrollView renders all cards at once.
        // Why it can be a problem: large trip lists will hurt performance/memory.
        // How to fix: use FlatList for virtualization when list size grows.
        contentContainerStyle={
          styles.contentContainer
        }
      >
        <ScreenHeader
          tripCount={trips.length}
        />

        <TripStats trips={trips} />

        <AddTripForm
  onAdd={(
    title,
    destination,
    date,
    rating,
    imageUri
  ) =>
    addTrip({
      title,
      destination,
      date,
      rating,
      imageUri,
    })
  }
/>

        {trips.length === 0 ? (
          <EmptyState />
        ) : (
          trips.map((trip) => (
            <Link
              key={trip.id}
              href={{
                // REVIEW: `as any` hides route typing errors.
                // How to fix: use proper Expo Router typed route instead of casting.
                pathname:
                  '/trip/[id]' as any,

                params: {
                  id: trip.id,
                  // REVIEW: These params are currently unused in trip detail screen
                  // (screen resolves trip by id from context), so this is dead payload.
                  // How to fix: pass only `id` unless detail screen starts using others.
                  title: trip.title,
                  destination:
                    trip.destination,
                  date: trip.date,
                  rating: String(
                    trip.rating
                  ),
                  imageUri:
                    trip.imageUri,
                },
              }}
              asChild
            >
              <Pressable>
                <TripCard
                  {...trip}
                  onDelete={() =>
                    deleteTrip(
                      trip.id
                    )
                  }
                />
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor:
      Colors.background,
  },

  safeArea: {
    flex: 1,

    backgroundColor:
      Colors.background,
  },

  container: {
    flex: 1,

    backgroundColor:
      Colors.background,
  },

  contentContainer: {
    padding: 16,

    paddingBottom: 40,
  },
});