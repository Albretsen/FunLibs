import React, { useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

const CustomBackground = ({ style, animatedIndex }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#ffffff", "#F0F1EC"]
    ),
    borderRadius: 30,
  }));

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;