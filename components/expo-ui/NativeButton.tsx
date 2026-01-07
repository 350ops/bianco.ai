/**
 * Fallback Button for Android/Web
 * Uses standard React Native components styled to match iOS aesthetic
 */
import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

import useThemeColors from '@/app/contexts/ThemeColors';

export type NativeButtonVariant =
  | 'default'
  | 'bordered'
  | 'borderedProminent'
  | 'borderless'
  | 'plain'
  | 'glass'
  | 'glassProminent';

export type NativeButtonSize = 'mini' | 'small' | 'regular' | 'large' | 'extraLarge';

export interface NativeButtonProps {
  label: string;
  onPress?: () => void;
  variant?: NativeButtonVariant;
  size?: NativeButtonSize;
  systemImage?: string;
  tintColor?: string;
  textColor?: string;
  disabled?: boolean;
}

export function NativeButton({
  label,
  onPress,
  variant = 'default',
  size = 'regular',
  tintColor,
  textColor,
  disabled = false,
}: NativeButtonProps) {
  const colors = useThemeColors();

  const getSizeStyles = () => {
    switch (size) {
      case 'mini':
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 };
      case 'small':
        return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 };
      case 'large':
        return { paddingHorizontal: 20, paddingVertical: 14, fontSize: 18 };
      case 'extraLarge':
        return { paddingHorizontal: 24, paddingVertical: 16, fontSize: 20 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 10, fontSize: 16 };
    }
  };

  const getVariantStyles = () => {
    const bgColor = tintColor || colors.primary;
    const fgColor = textColor || '#FFFFFF';

    switch (variant) {
      case 'bordered':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: bgColor,
          textColor: bgColor,
        };
      case 'borderedProminent':
        return {
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: bgColor,
          textColor: fgColor,
        };
      case 'borderless':
      case 'plain':
        return {
          backgroundColor: 'transparent',
          textColor: bgColor,
        };
      case 'glass':
      case 'glassProminent':
        return {
          backgroundColor: `${bgColor}33`, // 20% opacity
          textColor: bgColor,
        };
      default:
        return {
          backgroundColor: bgColor,
          textColor: fgColor,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          backgroundColor: variantStyles.backgroundColor,
          borderWidth: variantStyles.borderWidth || 0,
          borderColor: variantStyles.borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyles.fontSize,
            color: variantStyles.textColor,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

export default NativeButton;
