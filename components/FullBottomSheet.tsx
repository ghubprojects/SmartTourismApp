import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const THRESHOLD = 36;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const EXPAND_POSITION = SCREEN_HEIGHT * 0.18;
const MIDDLE_POSITION = SCREEN_HEIGHT * 0.5;
const HIDDEN_POSITION = SCREEN_HEIGHT * 0.91;

const Status = {
  Expand: 'expand',
  Middle: 'middle',
  Hidden: 'hidden',
};

interface FullBottomSheetProps {
  children: React.ReactNode;
}

export default function FullBottomSheet({ children }: FullBottomSheetProps) {
  const status = useSharedValue(Status.Expand);
  const position = useSharedValue(EXPAND_POSITION);

  const currentPositions: Record<string, number> = {
    expand: EXPAND_POSITION,
    middle: MIDDLE_POSITION,
    hidden: HIDDEN_POSITION,
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (
        (status.value == Status.Expand && e.translationY > 0) ||
        (status.value == Status.Hidden && e.translationY < 0) ||
        (status.value == Status.Middle && e.translationY < 0) ||
        (status.value == Status.Middle && e.translationY > 0)
      ) {
        position.value = currentPositions[status.value] + e.translationY;
      }
    })
    .onEnd((e) => {
      const isDirectionUp = e.translationY < 0;
      const isOverThreshold = Math.abs(e.translationY) > THRESHOLD;
      switch (status.value) {
        case Status.Expand:
          if (!isDirectionUp && isOverThreshold) {
            position.value = withSpring(MIDDLE_POSITION, { duration: 1000, dampingRatio: 1 });
            status.value = Status.Middle;
          } else {
            position.value = withSpring(EXPAND_POSITION, { duration: 1000, dampingRatio: 1 });
          }
          break;
        case Status.Hidden:
          if (isDirectionUp && isOverThreshold) {
            position.value = withSpring(MIDDLE_POSITION, { duration: 1000, dampingRatio: 1 });
            status.value = Status.Middle;
          } else {
            position.value = withSpring(HIDDEN_POSITION, { duration: 1000, dampingRatio: 1 });
          }
          break;
        case Status.Middle:
          if (isDirectionUp && isOverThreshold) {
            position.value = withSpring(EXPAND_POSITION, { duration: 1000, dampingRatio: 1 });
            status.value = Status.Expand;
          } else if (!isDirectionUp && isOverThreshold) {
            position.value = withSpring(HIDDEN_POSITION, { duration: 1000, dampingRatio: 1 });
            status.value = Status.Hidden;
          } else {
            position.value = withSpring(MIDDLE_POSITION, { duration: 1000, dampingRatio: 1 });
          }
          break;
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
