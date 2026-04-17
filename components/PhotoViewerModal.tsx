import { useRef } from 'react';
import { Animated, Modal, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PhotoViewerModalProps {
  uri: string | null;
  onClose: () => void;
  onDelete: (uri: string) => void;
  onSetAsMain: (uri: string) => void;
}

const SWIPE_DISMISS_THRESHOLD = 120;

function useSwipeToDismiss(onDismiss: () => void) {
  const translateY = useRef(new Animated.Value(0)).current;

  // Assign during render so the PanResponder (created once) always sees the latest callback.
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dy) > Math.abs(gs.dx) && gs.dy > 0,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > SWIPE_DISMISS_THRESHOLD) {
          translateY.setValue(0);
          onDismissRef.current();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return { translateY, panHandlers: panResponder.panHandlers };
}

export default function PhotoViewerModal({
  uri,
  onClose,
  onDelete,
  onSetAsMain,
}: PhotoViewerModalProps) {
  const { translateY, panHandlers } = useSwipeToDismiss(onClose);

  return (
    <Modal visible={!!uri} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {uri && (
          <>
            <Animated.Image
              source={{ uri }}
              style={[styles.image, { transform: [{ translateY }] }]}
              resizeMode="contain"
              {...panHandlers}
            />

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>

            <Pressable style={styles.deleteButton} onPress={() => onDelete(uri)}>
              <Ionicons name="trash-outline" size={26} color="#fff" />
            </Pressable>

            <Pressable style={styles.setMainButton} onPress={() => onSetAsMain(uri)}>
              <Ionicons name="star-outline" size={22} color="#fff" />
              <Text style={styles.setMainText}>Set as main</Text>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  setMainButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  setMainText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
