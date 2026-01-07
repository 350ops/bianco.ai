import React, { useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';

import ActionSheetThemed from '@/components/ActionSheetThemed';
import { Button } from '@/components/Button';
import Expandable from '@/components/Expandable';
import Header from '@/components/Header';
import ListLink from '@/components/ListLink';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Input from '@/components/forms/Input';
import Switch from '@/components/forms/Switch';
import Section from '@/components/layout/Section';

// Try to import @expo/ui components for iOS 26+
let useExpoUI = false;
let Host: any, Form: any, ExpoSection: any, ExpoSwitch: any, DisclosureGroup: any, ExpoButton: any;

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
      ExpoButton = expoUI.Button;
    }
  } catch (e) {
    // @expo/ui not available
  }
}

// Native iOS 26 Security Settings
function NativeSecuritySettings({ onLogoutPress }: { onLogoutPress: () => void }) {
  const [verification, setVerification] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [syncContacts, setSyncContacts] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [passcodeExpanded, setPasscodeExpanded] = useState(false);
  const [verificationExpanded, setVerificationExpanded] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <ExpoSection title="🔐 Security">
          <DisclosureGroup
            label="Passcode"
            isExpanded={passcodeExpanded}
            onStateChange={setPasscodeExpanded}>
            <ExpoSwitch value={false} label="Enable Passcode" onValueChange={() => {}} />
          </DisclosureGroup>

          <DisclosureGroup
            label="2-Step Verification"
            isExpanded={verificationExpanded}
            onStateChange={setVerificationExpanded}>
            <ExpoSwitch
              value={verification}
              label="Enable 2-Step Verification"
              onValueChange={setVerification}
            />
          </DisclosureGroup>

          <ExpoButton
            label="Logout"
            systemImage="rectangle.portrait.and.arrow.right"
            onPress={onLogoutPress}
          />
        </ExpoSection>

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

// Classic Security Settings
function ClassicSecuritySettings({
  logoutDrawerRef,
}: {
  logoutDrawerRef: React.RefObject<ActionSheetRef | null>;
}) {
  const [verification, setVerification] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  return (
    <ThemedScroller>
      <Section title="Security and privacy" titleSize="4xl" className="mb-10 mt-4" />
      <Section title="Security" titleSize="2xl" className="mb-4 mt-10">
        <Expandable
          title="Passcode"
          description="Enable a passcode to secure your account"
          icon="KeyRound">
          <Input placeholder="Password" secureTextEntry />
          <Input placeholder="Repeat password" secureTextEntry />
        </Expandable>
        <Expandable title="2-step verification" description="Status: On" icon="Fingerprint">
          <Switch
            className="mb-6"
            label="Enable"
            description="Second layer of security"
            value={verification}
            onChange={setVerification}
          />
        </Expandable>
        <ListLink
          title="Logout"
          onPress={() => {
            logoutDrawerRef.current?.show();
          }}
          description="Logout of your account"
          icon="LogOut"
        />
      </Section>

      <Section title="Privacy" titleSize="2xl" className="mb-4 mt-10">
        <Switch
          icon="Users"
          className="mt-3 border-b border-border pb-6"
          label="Sync your contacts"
          description="Find friends from your contacts"
          value={verification}
          onChange={setVerification}
        />
        <Switch
          icon="Globe"
          className="mt-3 border-b border-border pb-6"
          label="Location sharing"
          description="Share your location in posts"
          value={locationTracking}
          onChange={setLocationTracking}
        />
        <Switch
          icon="Eye"
          className="mt-3 border-b border-border pb-6"
          label="Private account"
          description="Only followers can see your posts"
          value={verification}
          onChange={setVerification}
        />
        <Switch
          icon="MessageCircle"
          className="mb-6 mt-3 pb-6"
          label="Read receipts"
          description="Let others know when you've read their messages"
          value={locationTracking}
          onChange={setLocationTracking}
        />
      </Section>
    </ThemedScroller>
  );
}

export default function CardControlsScreen() {
  const logoutDrawerRef = useRef<ActionSheetRef>(null);

  if (useExpoUI) {
    return (
      <>
        <Header showBackButton />
        <NativeSecuritySettings
          onLogoutPress={() => {
            logoutDrawerRef.current?.show();
          }}
        />
        <LogoutDrawer ref={logoutDrawerRef} />
      </>
    );
  }

  return (
    <>
      <Header showBackButton />
      <ClassicSecuritySettings logoutDrawerRef={logoutDrawerRef} />
      <LogoutDrawer ref={logoutDrawerRef} />
    </>
  );
}

const LogoutDrawer = React.forwardRef<ActionSheetRef>((props, ref) => {
  return (
    <ActionSheetThemed gestureEnabled ref={ref}>
      <View className="items-center p-global pt-10">
        <ThemedText className="text-3xl font-bold">Logout?</ThemedText>
        <ThemedText className="mb-4 text-center text-base">
          Are you sure you want to logout of your account?
        </ThemedText>
        <View className="mt-14 flex-row items-center justify-center gap-2">
          <Button title="Cancel" className="flex-1" variant="outline" rounded="full" />
          <Button title="Logout" className="flex-1" rounded="full" />
        </View>
      </View>
    </ActionSheetThemed>
  );
});
