import React from 'react';
import { View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

import Expandable from '@/components/Expandable';
import ThemedText from '@/components/ThemedText';
import Toggle from '@/components/Toggle';
import Slider from '@/components/forms/Slider';
import List from '@/components/layout/List';
import ListItem from '@/components/layout/ListItem';

type AdvancedSettingsLike = {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  autoPlayReverse?: boolean;
  loop?: boolean;
  pagingEnabled?: boolean;
  snapEnabled?: boolean;
  vertical?: boolean;
};

interface CarouselAdvancedSettingsPanelProps {
  carouselRef: React.RefObject<ICarouselInstance | null>;
  advancedSettings: AdvancedSettingsLike;
  onAdvancedSettingsChange: (patch: Partial<AdvancedSettingsLike>) => void;
  defaultExpanded?: boolean;
}

export function CarouselAdvancedSettingsPanel({
  advancedSettings,
  onAdvancedSettingsChange,
  defaultExpanded = false,
}: CarouselAdvancedSettingsPanelProps) {
  const interval = advancedSettings.autoPlayInterval ?? 2000;

  return (
    <Expandable
      title="Advanced carousel settings"
      description="Tune autoplay, looping, paging and snapping"
      defaultExpanded={defaultExpanded}
      className="mt-3">
      <List variant="divided" className="overflow-hidden rounded-2xl">
        <ListItem
          title="Autoplay"
          trailing={
            <Toggle
              value={!!advancedSettings.autoPlay}
              onChange={(v) => onAdvancedSettingsChange({ autoPlay: v })}
            />
          }
        />
        <View className="border-b border-border px-4 py-3">
          <ThemedText className="text-sm font-semibold">
            Autoplay interval: {Math.round(interval)}ms
          </ThemedText>
          <View className="mt-3">
            <Slider
              value={interval}
              minValue={800}
              maxValue={6000}
              step={100}
              onValueChange={(v) => onAdvancedSettingsChange({ autoPlayInterval: v })}
            />
          </View>
        </View>
        <ListItem
          title="Autoplay reverse"
          trailing={
            <Toggle
              value={!!advancedSettings.autoPlayReverse}
              onChange={(v) => onAdvancedSettingsChange({ autoPlayReverse: v })}
            />
          }
        />
        <ListItem
          title="Loop"
          trailing={
            <Toggle
              value={!!advancedSettings.loop}
              onChange={(v) => onAdvancedSettingsChange({ loop: v })}
            />
          }
        />
        <ListItem
          title="Paging enabled"
          trailing={
            <Toggle
              value={advancedSettings.pagingEnabled ?? true}
              onChange={(v) => onAdvancedSettingsChange({ pagingEnabled: v })}
            />
          }
        />
        <ListItem
          title="Snap enabled"
          trailing={
            <Toggle
              value={advancedSettings.snapEnabled ?? true}
              onChange={(v) => onAdvancedSettingsChange({ snapEnabled: v })}
            />
          }
        />
        <ListItem
          title="Vertical"
          subtitle="Off = horizontal"
          trailing={
            <Toggle
              value={!!advancedSettings.vertical}
              onChange={(v) => onAdvancedSettingsChange({ vertical: v })}
            />
          }
        />
      </List>
    </Expandable>
  );
}

export default CarouselAdvancedSettingsPanel;
