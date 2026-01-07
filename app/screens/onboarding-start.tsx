import { router } from 'expo-router';
import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <ImageBackground
        source={require('@/assets/img/bedr.png')}
        className="absolute left-0 top-0 h-full w-full">
        <View
          style={{ bottom: insets.bottom }}
          className="relative flex-1 items-start justify-end px-10">
          <ThemedText className="font-outfit-bold text-3xl text-white">
            Welcome to your new home
          </ThemedText>
          <ThemedText className="text-lg text-white">Let's set up your account.</ThemedText>
          <View className="mt-8 flex flex-row items-center justify-center gap-2">
            <Pressable
              onPress={() => router.push('/screens/renovation-survey')}
              className="flex flex-1 flex-row items-center justify-center rounded-full bg-black py-4">
              <Text className="mr-4 text-lg font-semibold text-white">Let's get started</Text>
              <Icon name="ArrowRight" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
