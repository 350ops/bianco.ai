import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Platform } from 'react-native';

import { Button } from '@/components/Button';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import ThemedScroller from '@/components/ThemeScroller';
import Input from '@/components/forms/Input';
import Switch from '@/components/forms/Switch';

// Try to import @expo/ui components for iOS 26+
let useExpoUI = false;
let Host: any,
  Form: any,
  ExpoSection: any,
  ExpoSwitch: any,
  ExpoButton: any,
  VStack: any,
  HStack: any,
  ExpoText: any,
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
      ExpoButton = expoUI.Button;
      VStack = expoUI.VStack;
      HStack = expoUI.HStack;
      ExpoText = expoUI.Text;
      LabeledContent = expoUI.LabeledContent;
    }
  } catch (e) {
    // @expo/ui not available
  }
}

// Native iOS 26 Edit Profile
function NativeEditProfile({
  profileImage,
  onPickImage,
  onRemoveImage,
}: {
  profileImage: string | null;
  onPickImage: () => void;
  onRemoveImage: () => void;
}) {
  const [showEmail, setShowEmail] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <ExpoSection title="📷 Profile Photo">
          <VStack spacing={16} alignment="center">
            {profileImage ? (
              <HStack spacing={12}>
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  resizeMode="cover"
                />
              </HStack>
            ) : (
              <ExpoText size={14}>No photo selected</ExpoText>
            )}
            <HStack spacing={12}>
              <ExpoButton
                label={profileImage ? 'Change Photo' : 'Upload Photo'}
                systemImage="photo"
                onPress={onPickImage}
              />
              {profileImage && (
                <ExpoButton label="Remove" systemImage="trash" onPress={onRemoveImage} />
              )}
            </HStack>
          </VStack>
        </ExpoSection>

        <ExpoSection title="👤 Profile Information">
          <LabeledContent label="Nickname">
            <ExpoText>@scan3d_user</ExpoText>
          </LabeledContent>
          <LabeledContent label="Name">
            <ExpoText>Nova User</ExpoText>
          </LabeledContent>
          <LabeledContent label="Email">
            <ExpoText>user@scan3d.app</ExpoText>
          </LabeledContent>
        </ExpoSection>

        <ExpoSection title="🔒 Privacy">
          <ExpoSwitch value={showEmail} label="Show Email" onValueChange={setShowEmail} />
          <ExpoSwitch
            value={privateAccount}
            label="Private Account"
            onValueChange={setPrivateAccount}
          />
        </ExpoSection>
      </Form>
    </Host>
  );
}

// Classic Edit Profile
function ClassicEditProfile({
  profileImage,
  onPickImage,
  onRemoveImage,
}: {
  profileImage: string | null;
  onPickImage: () => void;
  onRemoveImage: () => void;
}) {
  return (
    <ThemedScroller>
      <View className="my-14 mb-8 flex-col items-center rounded-2xl">
        <TouchableOpacity onPress={onPickImage} className="relative" activeOpacity={0.9}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} className="h-28 w-28 rounded-full" />
          ) : (
            <View
              className="h-28 w-28 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <Icon name="Plus" size={25} className="text-light-subtext dark:text-dark-subtext" />
            </View>
          )}
        </TouchableOpacity>
        <View className="mt-4">
          <Button
            variant="outline"
            title={profileImage ? 'Change photo' : 'Upload photo'}
            className="text-light-subtext dark:text-dark-subtext text-sm"
            onPress={onPickImage}
          />

          {profileImage && (
            <Button
              className="mt-2"
              title="Remove photo"
              variant="outline"
              onPress={onRemoveImage}
            />
          )}
        </View>
      </View>
      <View className="rounded-2xl px-global pb-4 pt-10">
        <Input
          label="Nickname"
          value=""
          variant="underlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Name"
          value=""
          variant="underlined"
          containerClassName="flex-1"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Email"
          keyboardType="email-address"
          value=""
          variant="underlined"
          autoCapitalize="none"
          containerClassName="mb-0"
        />

        <Switch
          className="border-b border-border py-4"
          label="Show email"
          description="Show your email to other users"
          value
          onChange={() => {}}
        />
        <Switch
          className="py-4"
          label="Private account"
          description="Hide your profile from search engines"
          value
          onChange={() => {}}
        />
      </View>
    </ThemedScroller>
  );
}

export default function EditProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setProfileImage(null);

  if (useExpoUI) {
    return (
      <>
        <Header
          showBackButton
          title="Profile Settings"
          rightComponents={[<Button key="save" title="Save" />]}
        />
        <NativeEditProfile
          profileImage={profileImage}
          onPickImage={pickImage}
          onRemoveImage={removeImage}
        />
      </>
    );
  }

  return (
    <>
      <Header
        showBackButton
        title="Profile Settings"
        rightComponents={[<Button title="Save changes" />]}
      />
      <ClassicEditProfile
        profileImage={profileImage}
        onPickImage={pickImage}
        onRemoveImage={removeImage}
      />
    </>
  );
}
