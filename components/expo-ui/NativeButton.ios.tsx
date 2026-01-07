/**
 * Native iOS 26 Button using @expo/ui Swift UI components
 * This provides the native iOS 26 liquid glass button aesthetic
 */
import { Button } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  foregroundStyle,
  glassEffect,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import React from 'react';

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
  systemImage,
  tintColor,
  textColor,
  disabled = false,
}: NativeButtonProps) {
  const buttonModifiers: any[] = [];

  // Apply variant style
  if (variant !== 'default') {
    buttonModifiers.push(buttonStyle(variant));
  }

  // Apply size
  if (size !== 'regular') {
    buttonModifiers.push(controlSize(size));
  }

  // Apply tint color
  if (tintColor) {
    buttonModifiers.push(tint(tintColor));
  }

  // Apply text color
  if (textColor) {
    buttonModifiers.push(foregroundStyle(textColor));
  }

  // Add glass effect for glass variants
  if (variant === 'glass' || variant === 'glassProminent') {
    buttonModifiers.push(
      glassEffect({
        glass: { variant: 'regular', interactive: true },
      })
    );
  }

  return (
    <Button
      label={label}
      onPress={onPress}
      systemImage={systemImage}
      disabled={disabled}
      modifiers={buttonModifiers.length > 0 ? buttonModifiers : undefined}
    />
  );
}

export default NativeButton;
