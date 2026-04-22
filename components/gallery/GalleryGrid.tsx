import { FlatList, Image, Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';

interface GalleryGridProps {
  photoUris: string[];
  thumbnailSize: number;
  gap: number;
  onSelect: (uri: string) => void;
  onScroll: (offsetY: number) => void;
}

export default function GalleryGrid({
  photoUris,
  thumbnailSize,
  gap,
  onSelect,
  onScroll,
}: GalleryGridProps) {
  return (
    <FlatList
      data={photoUris}
      keyExtractor={(item) => item}
      numColumns={3}
      contentContainerStyle={[styles.listContent, { padding: gap, paddingBottom: 100 }]}
      columnWrapperStyle={{ gap }}
      onScroll={(event) => onScroll(event.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelect(item)} style={{ marginBottom: gap }}>
          <Image
            source={{ uri: item }}
            style={[
              styles.thumbnail,
              {
                width: thumbnailSize,
                height: thumbnailSize,
              },
            ]}
          />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  thumbnail: {
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
});
