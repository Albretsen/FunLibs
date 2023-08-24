import React, { useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

const CustomBackground = ({ style, animatedIndex }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const currentBgColor = interpolateColor(
      animatedIndex.value,
      [-1, 0],
      ['transparent', "#F0F1EC"]
    );
    return {
      backgroundColor: currentBgColor,
      borderRadius: 30,
    };
  });

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;