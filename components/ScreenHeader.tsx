import { StyleSheet, Text, View } from 'react-native';
import { Colors } from "@/constants/Colors";

interface ScreenHeaderProps {
    tripCount: number;
}

export default function ScreenHeader({ tripCount }: ScreenHeaderProps) {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.appName}>TravelSnap</Text>
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
        backgroundColor: Colors.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    badge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: Colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});