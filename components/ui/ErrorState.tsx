import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

interface ErrorStateProps {
  message: string;

  onRetry?: () => void;
}

export default function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <View
      style={
        styles.container
      }
    >
      <Ionicons
        name="alert-circle"
        size={56}
        color={
          Colors.accent
        }
      />

      <Text
        style={
          styles.text
        }
      >
        {message}
      </Text>

      {onRetry && (
        <Pressable
          style={
            styles.button
          }
          onPress={onRetry}
        >
          <Text
            style={
              styles.buttonText
            }
          >
            Try again
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      justifyContent:
        'center',

      alignItems:
        'center',

      padding: 24,
    },

    text: {
      color:
        Colors.accent,

      fontSize: 16,

      textAlign:
        'center',

      marginTop: 16,

      marginBottom: 20,
    },

    button: {
      backgroundColor:
        Colors.primary,

      paddingVertical: 12,

      paddingHorizontal: 20,

      borderRadius: 10,
    },

    buttonText: {
      color:
        Colors.background,

      fontWeight: 'bold',

      fontSize: 15,
    },
  });