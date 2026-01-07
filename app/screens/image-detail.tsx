import React from 'react';
import { View, Image, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header, { HeaderIcon } from '@/components/Header';

export default function ImageDetail() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Header
        variant="transparent"
        middleComponent={<Text className="text-lg font-bold text-white">Nov 25, 2025</Text>}
        showBackButton
        rightComponents={[<HeaderIcon icon="Trash" />]}
      />

      <View className="flex-1 items-center justify-center">
        <Image source={require('@/assets/img/scify-4.jpg')} className="h-full w-full" />
      </View>
      <View
        style={{ bottom: insets.bottom }}
        className="absolute bottom-0 left-0 right-0 px-global">
        <Pressable className="w-full items-center justify-center rounded-2xl bg-text px-global py-3">
          <Text className="text-invert">Remix</Text>
        </Pressable>
      </View>
    </>
  );
}
