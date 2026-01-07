import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, ImageBackground, Pressable, Text, Platform } from 'react-native';

import Avatar from '@/components/Avatar';
import Expandable from '@/components/Expandable';
import Header from '@/components/Header';
import ListLink from '@/components/ListLink';
import ThemedScroller from '@/components/ThemeScroller';
import ThemeToggle from '@/components/ThemeToggle';
import ThemedText from '@/components/ThemedText';
import Input from '@/components/forms/Input';
import Switch from '@/components/forms/Switch';
import Section from '@/components/layout/Section';

// Try to import @expo/ui components for iOS 26+ native UI
let useExpoUI = false;
let Host: any,
  Form: any,
  ExpoSection: any,
  ExpoSwitch: any,
  DisclosureGroup: any,
  VStack: any,
  HStack: any,
  ExpoText: any,
  Button: any,
  LabeledContent: any;

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
      VStack = expoUI.VStack;
      HStack = expoUI.HStack;
      ExpoText = expoUI.Text;
      Button = expoUI.Button;
      LabeledContent = expoUI.LabeledContent;
    }
  } catch {
    // @expo/ui not available
  }
}

// Native iOS 26 Account Screen using @expo/ui
function NativeAccountScreen() {
  const [verification, setVerification] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [syncContacts, setSyncContacts] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [securityExpanded, setSecurityExpanded] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        {/* Profile Header */}
        <ExpoSection title="👤 Profile">
          <HStack spacing={16}>
            <VStack alignment="leading">
              <ExpoText size={22} weight="bold">
                User
              </ExpoText>
              <ExpoText size={14}>@scan3d_user</ExpoText>
            </VStack>
          </HStack>
        </ExpoSection>

        {/* Settings Section */}
        <ExpoSection title="⚙️ Settings">
          <LabeledContent label="Notifications">
            <Button label="Manage" systemImage="bell" />
          </LabeledContent>
          <LabeledContent label="Help Center">
            <Button label="Get Help" systemImage="questionmark.circle" />
          </LabeledContent>
          <LabeledContent label="Edit Profile">
            <Button label="Edit" systemImage="person" />
          </LabeledContent>
        </ExpoSection>

        {/* Security Section */}
        <ExpoSection title="🔐 Security">
          <DisclosureGroup
            label="2-Step Verification"
            isExpanded={securityExpanded}
            onStateChange={setSecurityExpanded}>
            <ExpoSwitch
              value={verification}
              label="Enable 2-Step Verification"
              onValueChange={setVerification}
            />
          </DisclosureGroup>
        </ExpoSection>

        {/* Privacy Section */}
        <ExpoSection title="🔒 Privacy">
          <ExpoSwitch value={syncContacts} label="Sync Contacts" onValueChange={setSyncContacts} />
          <ExpoSwitch
            value={locationTracking}
            label="Location Sharing"
            onValueChange={setLocationTracking}
          />
          <ExpoSwitch
            value={privateAccount}
            label="Private Account"
            onValueChange={setPrivateAccount}
          />
          <ExpoSwitch value={readReceipts} label="Read Receipts" onValueChange={setReadReceipts} />
        </ExpoSection>
      </Form>
    </Host>
  );
}

// Classic Account Screen using existing components
function ClassicAccountScreen() {
  const [verification, setVerification] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  return (
    <ThemedScroller contentContainerStyle={{ paddingBottom: 120 }}>
      <Section title="Account" titleSize="4xl" className="mb-10 mt-10" />

      {/* Subscription Card */}
      <SubscribeCard />

      {/* Settings Section */}
      <Section title="Settings" titleSize="lg" className="mb-4 mt-10">
        <View className="overflow-hidden rounded-2xl">
          <ListLink
            title="Notifications"
            description="Customize how you get updates"
            showChevron
            icon="Bell"
            href="/screens/notification-settings"
          />
          <ListLink
            title="Help"
            description="Get help with your account"
            showChevron
            icon="HelpCircle"
            href="/screens/help"
          />
          <ListLink
            title="Edit Profile"
            description="Manage your profile"
            showChevron
            icon="User"
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
            className="!border-b-0"
            description="Logout of your account"
            icon="LogOut"
            href="/screens/welcome"
          />
        </View>
      </Section>

      {/* Security Section */}
      <Section title="Security" titleSize="lg" className="mb-4 mt-10">
        <View className="overflow-hidden rounded-2xl">
          <Expandable
            title="Passcode"
            description="Enable a passcode to secure your account"
            icon="KeyRound">
            <Input placeholder="Password" secureTextEntry />
            <Input placeholder="Repeat password" secureTextEntry />
          </Expandable>
          <Expandable
            title="2-step verification"
            className="!border-b-0"
            description="Status: On"
            icon="Fingerprint">
            <Switch
              className="mb-6"
              label="Enable"
              description="Second layer of security"
              value={verification}
              onChange={setVerification}
            />
          </Expandable>
        </View>
      </Section>

      {/* Privacy Section */}
      <Section title="Privacy" titleSize="lg" className="mb-4 mt-10">
        <View className="overflow-hidden rounded-2xl">
          <Switch
            icon="Users"
            label="Sync your contacts"
            description="Find friends from your contacts"
            value={verification}
            onChange={setVerification}
          />
          <Switch
            icon="Globe"
            label="Location sharing"
            description="Share your location in posts"
            value={locationTracking}
            onChange={setLocationTracking}
          />
          <Switch
            icon="Eye"
            label="Private account"
            description="Only followers can see your posts"
            value={verification}
            onChange={setVerification}
          />
          <Switch
            icon="MessageCircle"
            label="Read receipts"
            className="!border-b-0"
            description="Let others know when you've read their messages"
            value={locationTracking}
            onChange={setLocationTracking}
          />
        </View>
      </Section>
    </ThemedScroller>
  );
}

export default function AccountScreen() {
  // Use native iOS 26 UI when available
  if (useExpoUI) {
    return (
      <View className="flex-1 bg-background">
        <Header
          leftComponent={<Avatar src={require('@/assets/img/user.png')} size="sm" />}
          rightComponents={[<ThemeToggle key="theme" />]}
        />
        <NativeAccountScreen />
      </View>
    );
  }

  // Fallback to classic account screen
  return (
    <View className="flex-1 bg-background">
      <Header
        leftComponent={<Avatar src={require('@/assets/img/user.png')} size="sm" />}
        rightComponents={[<ThemeToggle key="theme" />]}
      />
      <ClassicAccountScreen />
    </View>
  );
}

const SubscribeCard = () => {
  return (
    <Link asChild href="/screens/subscription">
      <Pressable className="flex w-full flex-row overflow-hidden rounded-3xl bg-rose-500">
        <ImageBackground
          source={require('@/assets/img/livin.png')}
          className="min-h-[180px] flex-1 flex-row items-center pl-8 pr-6"
          imageStyle={{ borderRadius: 24 }}>
          <BlurView
            intensity={10}
            tint="light"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 24,
            }}
          />
          <View className="w-2/3 pr-6">
            <ThemedText className="text-xl font-extrabold text-white">scan3D</ThemedText>
            <ThemedText className="text-sm font-extrabold text-white">
              Visualize your space in 3D
            </ThemedText>
            <View className="mr-auto mt-3 rounded-lg bg-white px-3 py-2">
              <Text className="text-sm text-black">Upgrade to scan3D Pro</Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
};
