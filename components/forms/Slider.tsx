import RNCommunitySlider from '@react-native-community/slider';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import ThemedText from '../ThemedText';

import useThemeColors from '@/app/contexts/ThemeColors';

type SliderSize = 's' | 'm' | 'l';

interface SliderProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  value?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
  label?: string;
  maxValue?: number;
  minValue?: number;
  step?: number;
  size?: SliderSize;
}

const sizeStyles = {
  s: { labelText: 'text-xs', valueText: 'text-xs' },
  m: { labelText: 'text-sm', valueText: 'text-sm' },
  l: { labelText: 'text-base', valueText: 'text-base' },
} as const;

/**
 * NOTE: This project uses `react-native-reanimated@4`, where `useAnimatedGestureHandler`
 * is not available. This slider intentionally uses `@react-native-community/slider`
 * for a stable, non-crashing implementation.
 */
const Slider = ({
  className = '',
  style,
  value,
  initialValue,
  onValueChange,
  label,
  maxValue = 100,
  minValue = 0,
  step = 1,
  size = 'm',
}: SliderProps) => {
  const colors = useThemeColors();
  const currentSize = sizeStyles[size];

  const isControlled = value !== undefined;
  const initial = useMemo(() => {
    if (value !== undefined) return value;
    if (initialValue !== undefined) return initialValue;
    return minValue;
  }, [initialValue, minValue, value]);

  const [internalValue, setInternalValue] = useState<number>(initial);
  const effectiveValue = isControlled ? (value as number) : internalValue;

  useEffect(() => {
    if (isControlled) return;
    setInternalValue((v) => Math.max(minValue, Math.min(maxValue, v)));
  }, [isControlled, maxValue, minValue]);

  const handleChange = (v: number) => {
    if (!isControlled) setInternalValue(v);
    onValueChange?.(v);
  };

  return (
    <View className={`w-full ${className}`} style={style}>
      {label && (
        <View className="mb-2 flex-row justify-between">
          <ThemedText className={`${currentSize.labelText} font-medium`}>{label}</ThemedText>
          <ThemedText className={`${currentSize.valueText} opacity-60`}>
            {Math.round(effectiveValue)}
          </ThemedText>
        </View>
      )}

      <RNCommunitySlider
        value={effectiveValue}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={step}
        onValueChange={handleChange}
        minimumTrackTintColor={colors.highlight}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.text}
      />
    </View>
  );
};

export default Slider;
