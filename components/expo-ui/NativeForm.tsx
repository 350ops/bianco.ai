/**
 * Fallback Form components for Android/Web
 * Uses standard React Native components styled to match iOS aesthetic
 */
import Slider from '@react-native-community/slider';
import React, { ReactNode, useState } from 'react';
import {
  View,
  Text as RNText,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch as RNSwitch,
} from 'react-native';

import useThemeColors from '@/app/contexts/ThemeColors';

// Fallback Host - just a View wrapper
export function Host({ children, style }: { children: ReactNode; style?: any }) {
  return <View style={[{ flex: 1 }, style]}>{children}</View>;
}

// Fallback Form - ScrollView wrapper
export function Form({ children }: { children: ReactNode }) {
  const colors = useThemeColors();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}>
      {children}
    </ScrollView>
  );
}

// Fallback Section
interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.section}>
      <RNText style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</RNText>
      <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>{children}</View>
    </View>
  );
}

// Fallback VStack
interface VStackProps {
  children: ReactNode;
  spacing?: number;
  alignment?: 'leading' | 'center' | 'trailing';
}

export function VStack({ children, spacing = 8, alignment = 'leading' }: VStackProps) {
  const alignItems =
    alignment === 'leading' ? 'flex-start' : alignment === 'trailing' ? 'flex-end' : 'center';

  return <View style={{ gap: spacing, alignItems }}>{children}</View>;
}

// Fallback HStack
interface HStackProps {
  children: ReactNode;
  spacing?: number;
  alignment?: 'top' | 'center' | 'bottom';
}

export function HStack({ children, spacing = 8, alignment = 'center' }: HStackProps) {
  const alignItems =
    alignment === 'top' ? 'flex-start' : alignment === 'bottom' ? 'flex-end' : 'center';

  return <View style={{ flexDirection: 'row', gap: spacing, alignItems }}>{children}</View>;
}

// Fallback Text
interface TextProps {
  children: ReactNode;
  size?: number;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
  modifiers?: any[];
}

export function Text({ children, size = 14, weight = 'regular', color }: TextProps) {
  const colors = useThemeColors();
  const fontWeight = weight === 'bold' ? '700' : weight === 'semibold' ? '600' : '400';

  return (
    <RNText style={{ fontSize: size, fontWeight, color: color || colors.text }}>{children}</RNText>
  );
}

// Fallback Button
interface ButtonProps {
  label: string;
  onPress?: () => void;
  systemImage?: string;
  modifiers?: any[];
}

export function Button({ label, onPress }: ButtonProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
      ]}>
      <RNText style={styles.buttonText}>{label}</RNText>
    </Pressable>
  );
}

// Fallback Switch
interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

export function Switch({ value, onValueChange, label }: SwitchProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.switchRow}>
      <RNText style={[styles.switchLabel, { color: colors.text }]}>{label}</RNText>
      <RNSwitch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary }} />
    </View>
  );
}

// Fallback Picker
interface PickerProps {
  label: string;
  selection: string;
  onSelectionChange: (value: string) => void;
}

export function Picker({ label, selection, onSelectionChange }: PickerProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.pickerRow}>
      <RNText style={[styles.pickerLabel, { color: colors.text }]}>{label}</RNText>
      <RNText style={[styles.pickerValue, { color: colors.textSecondary }]}>{selection}</RNText>
    </View>
  );
}

// Fallback DisclosureGroup
interface DisclosureGroupProps {
  label: string;
  isExpanded: boolean;
  onStateChange: (expanded: boolean) => void;
  children: ReactNode;
}

export function DisclosureGroup({
  label,
  isExpanded,
  onStateChange,
  children,
}: DisclosureGroupProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.disclosureGroup}>
      <Pressable
        onPress={() => onStateChange(!isExpanded)}
        style={[styles.disclosureHeader, { borderBottomColor: colors.border }]}>
        <RNText style={[styles.disclosureLabel, { color: colors.text }]}>{label}</RNText>
        <RNText style={{ color: colors.textSecondary }}>{isExpanded ? '▼' : '▶'}</RNText>
      </Pressable>
      {isExpanded && <View style={styles.disclosureContent}>{children}</View>}
    </View>
  );
}

// Fallback LabeledContent
interface LabeledContentProps {
  label: string;
  children: ReactNode;
}

export function LabeledContent({ label, children }: LabeledContentProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.labeledContent}>
      <RNText style={[styles.labeledLabel, { color: colors.text }]}>{label}</RNText>
      <View>{children}</View>
    </View>
  );
}

// Fallback Spacer
export function Spacer() {
  return <View style={{ flex: 1 }} />;
}

// Re-export modifiers (no-op for fallback)
export const modifiers = {
  buttonStyle: () => null,
  controlSize: () => null,
  foregroundStyle: () => null,
  frame: () => null,
  glassEffect: () => null,
  background: () => null,
  clipShape: () => null,
  cornerRadius: () => null,
};

// NativeForm wrapper
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

// NativeSection wrapper
interface NativeSectionProps {
  title: string;
  children: ReactNode;
}

export function NativeSection({ title, children }: NativeSectionProps) {
  return <Section title={title}>{children}</Section>;
}

// NativeSwitch wrapper
interface NativeSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

export function NativeSwitch({ value, onValueChange, label }: NativeSwitchProps) {
  return <Switch value={value} label={label} onValueChange={onValueChange} />;
}

// NativeButton wrapper
interface NativeButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'bordered' | 'glass' | 'glassProminent';
  size?: 'mini' | 'small' | 'regular' | 'large';
  systemImage?: string;
}

export function NativeButton({ label, onPress }: NativeButtonProps) {
  return <Button label={label} onPress={onPress} />;
}

// NativeSlider wrapper
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
  const colors = useThemeColors();
  return (
    <Slider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      minimumTrackTintColor={colors.primary}
      thumbTintColor={colors.primary}
      style={{ width: '100%' }}
    />
  );
}

// NativePicker wrapper
interface NativePickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options?: string[];
}

export function NativePicker({ label, value, onValueChange }: NativePickerProps) {
  return <Picker label={label} selection={value} onSelectionChange={onValueChange} />;
}

// NativeDisclosureGroup wrapper
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

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 16,
  },
  sectionContent: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  pickerLabel: {
    fontSize: 16,
  },
  pickerValue: {
    fontSize: 16,
  },
  disclosureGroup: {
    marginTop: 8,
  },
  disclosureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  disclosureLabel: {
    fontSize: 16,
  },
  disclosureContent: {
    paddingTop: 12,
    gap: 12,
  },
  labeledContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labeledLabel: {
    fontSize: 16,
  },
});

export default NativeForm;
