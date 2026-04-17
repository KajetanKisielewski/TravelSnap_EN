import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

const SCROLL_SENSITIVITY = 5;   // minimum px delta to trigger show/hide
const FAB_HIDDEN_OFFSET = 100;  // translateY when hidden (pushes FAB off-screen)
const ANIMATION_DURATION = 200; // ms

export function useScrollFab() {
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const y = event.nativeEvent.contentOffset.y;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      const scrollingDown = delta > SCROLL_SENSITIVITY;
      const scrollingUp = delta < -SCROLL_SENSITIVITY || y <= 0;

      const animateFab = (toValue: number): void => {
        Animated.timing(translateY, {
          toValue,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
      };

      if (scrollingDown && !isHidden.current) {
        isHidden.current = true;
        animateFab(FAB_HIDDEN_OFFSET);
      } else if (scrollingUp && isHidden.current) {
        isHidden.current = false;
        animateFab(0);
      }
    },
    [translateY]
  );

  return { translateY, onScroll };
}
