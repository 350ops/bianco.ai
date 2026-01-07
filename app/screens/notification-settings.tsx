import { useState } from 'react';
import { View, Platform } from 'react-native';

import Header from '@/components/Header';
import ThemedScroller from '@/components/ThemeScroller';
import Switch from '@/components/forms/Switch';
import Section from '@/components/layout/Section';

// Try to import @expo/ui components for iOS 26+
let useExpoUI = false;
let Host: any, Form: any, ExpoSection: any, ExpoSwitch: any;

if (Platform.OS === 'ios') {
  try {
    const expoUI = require('@expo/ui/swift-ui');
    if (expoUI?.Form && expoUI?.Section) {
      useExpoUI = true;
      Host = expoUI.Host;
      Form = expoUI.Form;
      ExpoSection = expoUI.Section;
      ExpoSwitch = expoUI.Switch;
    }
  } catch (e) {
    // @expo/ui not available
  }
}

// Native iOS 26 Notification Settings
function NativeNotificationSettings() {
  const [generationComplete, setGenerationComplete] = useState(true);
  const [estimateReady, setEstimateReady] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [systemUpdates, setSystemUpdates] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <ExpoSection title="AI Generation">
          <ExpoSwitch
            value={generationComplete}
            label="Generation Complete"
            onValueChange={setGenerationComplete}
          />
        </ExpoSection>

        <ExpoSection title="Estimates">
          <ExpoSwitch
            value={estimateReady}
            label="Estimate Ready"
            onValueChange={setEstimateReady}
          />
        </ExpoSection>

        <ExpoSection title="Marketing">
          <ExpoSwitch
            value={promotions}
            label="Promotions & Offers"
            onValueChange={setPromotions}
          />
          <ExpoSwitch
            value={systemUpdates}
            label="System Updates"
            onValueChange={setSystemUpdates}
          />
        </ExpoSection>
      </Form>
    </Host>
  );
}

// Classic Notification Settings
function ClassicNotificationSettings() {
  const [generationComplete, setGenerationComplete] = useState(true);

  return (
    <ThemedScroller className="p-global">
      <Section title="Notification Settings" titleSize="4xl" className="mb-10 mt-4" />
      <View className="overflow-hidden rounded-2xl">
        <Switch
          label="Generation complete"
          description="When your AI image generation is ready"
          icon="Sparkles"
          value={generationComplete}
          onChange={setGenerationComplete}
          className="!border-b-0"
        />
      </View>
    </ThemedScroller>
  );
}

export default function NotificationSettingsScreen() {
  if (useExpoUI) {
    return (
      <>
        <Header showBackButton />
        <NativeNotificationSettings />
      </>
    );
  }

  return (
    <>
      <Header showBackButton />
      <ClassicNotificationSettings />
    </>
  );
}
