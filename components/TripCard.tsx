import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import RatingStars from './RatingStars';

export interface TripCardProps {
    id: string;
    title: string;
    destination: string;
    date: string;
    rating: number;
    onDelete: (id: string) => void;
}

export default function TripCard({ id, title, destination, date, rating, onDelete }: TripCardProps) {
    return (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.meta}>{destination} | {date}</Text>
                <RatingStars rating={rating} />
            </View>

            <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteBtn}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e' },
    meta: { fontSize: 14, color: '#888' },
    deleteBtn: { padding: 8 }
});