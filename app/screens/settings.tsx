import React, { useState } from 'react';
import { View, Platform } from 'react-native';

import Header from '@/components/Header';
import ListLink from '@/components/ListLink';
import ThemedScroller from '@/components/ThemeScroller';
import ThemeToggle from '@/components/ThemeToggle';
import Section from '@/components/layout/Section';

// Try to import @expo/ui components for iOS 26+
let useExpoUI = false;
let Host: any, Form: any, ExpoSection: any, ExpoSwitch: any, DisclosureGroup: any, Picker: any;

if (Platform.OS === 'ios') {
  try {
    const expoUI = require('@expo/ui/swift-ui');
    if (expoUI?.Form && expoUI?.Section) {
      useExpoUI = true;
      Host = expoUI.Host;
      Form = expoUI.Form;
      ExpoSection = expoUI.Section;
      ExpoSwitch = expoUI.Switch;
      DisclosureGroup = expoUI.DisclosureGroup;
      Picker = expoUI.Picker;
    }
  } catch {
    // @expo/ui not available
  }
}

// Native iOS 26 Settings using @expo/ui
function NativeSettings() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [theme, setTheme] = useState('auto');
  const [language, setLanguage] = useState('en');

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <ExpoSection title="Notifications">
          <ExpoSwitch
            value={notifications}
            label="Push Notifications"
            onValueChange={setNotifications}
          />
          <ExpoSwitch value={autoSave} label="Auto-save Changes" onValueChange={setAutoSave} />
        </ExpoSection>

        <ExpoSection title="Preferences">
          <DisclosureGroup
            label="Advanced Settings"
            isExpanded={advancedExpanded}
            onStateChange={setAdvancedExpanded}>
            <Picker
              label="App Theme"
              selection={theme}
              onSelectionChange={(selection: string) => setTheme(selection)}
            />
            <Picker
              label="Language"
              selection={language}
              onSelectionChange={(selection: string) => setLanguage(selection)}
            />
          </DisclosureGroup>
        </ExpoSection>
      </Form>
    </Host>
  );
}

// Classic settings using existing components
function ClassicSettings() {
  return (
    <ThemedScroller className="flex-1 pt-4">
      <Section title="Settings" titleSize="4xl" className="mb-14 mt-6">
        <ListLink
          title="Notifications"
          description="Customize how you get updates"
          showChevron
          icon="Bell"
          href="/screens/notification-settings"
        />
        <ListLink
          title="Security"
          description="Manage your security settings"
          showChevron
          icon="Shield"
          href="/screens/security"
        />
        <ListLink
          title="Help"
          description="Get help with your account"
          showChevron
          icon="HelpCircle"
          href="/screens/help"
        />
        <ListLink
          title="Profile"
          description="Manage your profile"
          showChevron
          icon="Settings"
          href="/screens/edit-profile"
        />
        <ListLink
          title="Language"
          description="Change your language"
          showChevron
          icon="Globe"
          href="/screens/languages"
        />
        <ListLink
          title="Logout"
          description="Logout of your account"
          icon="LogOut"
          href="/screens/welcome"
        />
      </Section>
    </ThemedScroller>
  );
}

export default function SettingsScreen() {
  // Use native iOS 26 UI when available
  if (useExpoUI) {
    return (
      <>
        <Header showBackButton rightComponents={[<ThemeToggle key="theme" />]} />
        <View className="flex-1">
          <NativeSettings />
        </View>
      </>
    );
  }

  // Fallback to classic settings
  return (
    <>
      <Header showBackButton rightComponents={[<ThemeToggle />]} />
      <View className="flex-1">
        <ClassicSettings />
      </View>
    </>
  );
}
