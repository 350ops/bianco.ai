import type { ViewStyle } from 'react-native';
import { interpolate, Extrapolation } from 'react-native-reanimated';

interface ParallaxConfig {
  size: number;
  vertical?: boolean;
}

interface ParallaxOptions {
  parallaxScrollingScale?: number;
  parallaxAdjacentItemScale?: number;
  parallaxScrollingOffset?: number;
}

export function parallaxLayout(config: ParallaxConfig, options: ParallaxOptions = {}) {
  const {
    parallaxScrollingScale = 1,
    parallaxAdjacentItemScale = 0.85,
    parallaxScrollingOffset = -30,
  } = options;

  return (value: number): ViewStyle => {
    'worklet';

    const scale = interpolate(
      value,
      [-2, -1, 0, 1, 2],
      [
        parallaxAdjacentItemScale * 0.9,
        parallaxAdjacentItemScale,
        parallaxScrollingScale,
        parallaxAdjacentItemScale,
        parallaxAdjacentItemScale * 0.9,
      ],
      Extrapolation.CLAMP
    );

    const translate = interpolate(
      value,
      [-2, -1, 0, 1, 2],
      [
        parallaxScrollingOffset * 2,
        parallaxScrollingOffset,
        0,
        -parallaxScrollingOffset,
        -parallaxScrollingOffset * 2,
      ],
      Extrapolation.CLAMP
    );

    // Higher z-index for center card, lower for adjacent
    const zIndex = interpolate(value, [-2, -1, 0, 1, 2], [0, 5, 100, 5, 0], Extrapolation.CLAMP);

    const opacity = interpolate(
      value,
      [-2, -1, 0, 1, 2],
      [0.5, 0.8, 1, 0.8, 0.5],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        config.vertical ? { translateY: translate } : { translateX: translate },
        { scale },
      ],
      zIndex: Math.round(zIndex),
      elevation: Math.round(zIndex), // For Android shadow
      opacity,
    };
  };
}
