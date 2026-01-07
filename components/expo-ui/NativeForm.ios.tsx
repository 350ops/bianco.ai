/**
 * Native iOS Form using @expo/ui Swift UI components
 * This provides the native iOS 26 liquid glass aesthetic
 */
import {
  Form,
  Host,
  Section,
  VStack,
  HStack,
  Text,
  Button,
  Switch,
  Slider,
  Picker,
  DisclosureGroup,
  LabeledContent,
  Spacer,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  foregroundStyle,
  frame,
  glassEffect,
  background,
  clipShape,
  cornerRadius,
} from '@expo/ui/swift-ui/modifiers';
import React, { ReactNode } from 'react';

// Re-export all components for easy use
export {
  Form,
  Host,
  Section,
  VStack,
  HStack,
  Text,
  Button,
  Switch,
  Slider,
  Picker,
  DisclosureGroup,
  LabeledContent,
  Spacer,
};

// Re-export modifiers
export const modifiers = {
  buttonStyle,
  controlSize,
  foregroundStyle,
  frame,
  glassEffect,
  background,
  clipShape,
  cornerRadius,
};

// Wrapper component for the Host + Form pattern
interface NativeFormProps {
  children: ReactNode;
}

export function NativeForm({ children }: NativeFormProps) {
  return (
    <Host style={{ flex: 1 }}>
      <Form>{children}</Form>
    </Host>
  );
}

// Native Section wrapper
interface NativeSectionProps {
  title: string;
  children: ReactNode;
}

export function NativeSection({ title, children }: NativeSectionProps) {
  return <Section title={title}>{children}</Section>;
}

// Native Switch wrapper
interface NativeSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

export function NativeSwitch({ value, onValueChange, label }: NativeSwitchProps) {
  return <Switch value={value} label={label} onValueChange={onValueChange} />;
}

// Native Button wrapper with glass effect
interface NativeButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'bordered' | 'glass' | 'glassProminent';
  size?: 'mini' | 'small' | 'regular' | 'large';
  systemImage?: string;
}

export function NativeButton({
  label,
  onPress,
  variant = 'default',
  size = 'regular',
  systemImage,
}: NativeButtonProps) {
  const buttonModifiers = [];

  if (variant !== 'default') {
    buttonModifiers.push(buttonStyle(variant));
  }

  if (size !== 'regular') {
    buttonModifiers.push(controlSize(size));
  }

  return (
    <Button
      label={label}
      onPress={onPress}
      systemImage={systemImage}
      modifiers={buttonModifiers.length > 0 ? buttonModifiers : undefined}
    />
  );
}

// Native Slider wrapper
interface NativeSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
}

export function NativeSlider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
}: NativeSliderProps) {
  // Normalize value to 0-1 range for @expo/ui Slider
  const normalizedValue = (value - minimumValue) / (maximumValue - minimumValue);

  const handleChange = (newValue: number) => {
    // Denormalize value back to original range
    const denormalizedValue = newValue * (maximumValue - minimumValue) + minimumValue;
    onValueChange(denormalizedValue);
  };

  return <Slider value={normalizedValue} onValueChange={handleChange} />;
}

// Native Picker wrapper
interface NativePickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options?: string[];
}

export function NativePicker({ label, value, onValueChange }: NativePickerProps) {
  return <Picker label={label} selection={value} onSelectionChange={onValueChange} />;
}

// Native Disclosure Group wrapper
interface NativeDisclosureGroupProps {
  label: string;
  isExpanded: boolean;
  onStateChange: (expanded: boolean) => void;
  children: ReactNode;
}

export function NativeDisclosureGroup({
  label,
  isExpanded,
  onStateChange,
  children,
}: NativeDisclosureGroupProps) {
  return (
    <DisclosureGroup label={label} isExpanded={isExpanded} onStateChange={onStateChange}>
      {children}
    </DisclosureGroup>
  );
}

export default NativeForm;
