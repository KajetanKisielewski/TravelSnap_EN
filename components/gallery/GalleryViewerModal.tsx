import type { PanResponderInstance } from 'react-native';
import { Animated, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

interface GalleryViewerModalProps {
  selectedUri: string | null;
  viewerTranslateY: Animated.Value;
  panResponder: PanResponderInstance;
  onClose: () => void;
  onDelete: () => void;
  onSetAsMain: () => void;
}

export default function GalleryViewerModal({
  selectedUri,
  viewerTranslateY,
  panResponder,
  onClose,
  onDelete,
  onSetAsMain,
}: GalleryViewerModalProps) {
  return (
    <Modal visible={!!selectedUri} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY: viewerTranslateY }] }]}
          {...panResponder.panHandlers}
        >
          {selectedUri && (
            <Image source={{ uri: selectedUri }} style={styles.viewerImage} resizeMode="contain" />
          )}

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={24} color={Colors.textPrimary} />
          </Pressable>

          <Pressable style={styles.setMainButton} onPress={onSetAsMain}>
            <Ionicons name="image-outline" size={20} color={Colors.background} />
            <Text style={styles.setMainButtonText}>Set as main</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalContent: {
    flex: 1,
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
  },
  setMainButton: {
    position: 'absolute',
    bottom: 46,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  setMainButtonText: {
    color: Colors.background,
    fontWeight: '700',
  },
});
