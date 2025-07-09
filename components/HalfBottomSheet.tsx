import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const THRESHOLD = 36;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const EXPAND_POSITION = SCREEN_HEIGHT * 0.49;
const HIDDEN_POSITION = SCREEN_HEIGHT * 0.9;

interface HalfBottomSheetProps {
  children: React.ReactNode;
}

export default function HalfBottomSheet({ children }: HalfBottomSheetProps) {
  const onExpand = useSharedValue(true);
  const position = useSharedValue(EXPAND_POSITION);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (!onExpand.value && e.translationY < 0) {
        position.value = HIDDEN_POSITION + e.translationY;
      } else if (onExpand.value && e.translationY > 0) {
        position.value = EXPAND_POSITION + e.translationY;
      }
    })
    .onEnd((e) => {
      if (onExpand.value) {
        if (e.translationY > 0 && Math.abs(e.translationY) > THRESHOLD) {
          position.value = withSpring(HIDDEN_POSITION, { duration: 1000, dampingRatio: 1 });
          onExpand.value = false;
        } else {
          position.value = withSpring(EXPAND_POSITION, { duration: 1000, dampingRatio: 1 });
        }
      } else {
        if (e.translationY < 0 && Math.abs(e.translationY) > THRESHOLD) {
          position.value = withSpring(EXPAND_POSITION, { duration: 1000, dampingRatio: 1 });
          onExpand.value = true;
        } else {
          position.value = withSpring(HIDDEN_POSITION, { duration: 1000, dampingRatio: 1 });
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.bottomSheet, animatedStyle]}>
        <View style={styles.bottomSheetHeader}>
          <View style={styles.dragIndicator} />
        </View>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 16,
    elevation: 10,
  },
  bottomSheetHeader: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIndicator: {
    width: 44,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
  },
});
