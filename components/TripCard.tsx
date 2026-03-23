import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TripCardProps {
  title: string;
  destination: string;
  date: string;
  rating: number;
  onDelete?: () => void;
}

export default function TripCard({
  title,
  destination,
  date,
  rating,
  onDelete,
}: TripCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Destination: {destination}</Text>
      <Text style={styles.text}>Date: {date}</Text>
      <Text style={styles.text}>Rating: {rating}</Text>

      {onDelete && (
        <Pressable onPress={onDelete}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  delete: {
    color: 'red',
    marginTop: 8,
    fontWeight: 'bold',
  },
});