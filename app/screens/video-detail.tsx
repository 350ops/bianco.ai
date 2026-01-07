import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header, { HeaderIcon } from '@/components/Header';

export default function ImageDetail() {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(require('@/assets/video/video.mp4'), (player) => {
    player.loop = true;
    player.play();
  });
  return (
    <>
      <Header
        variant="transparent"
        middleComponent={<Text className="text-lg font-bold text-white">Nov 25, 2025</Text>}
        showBackButton
        rightComponents={[<HeaderIcon icon="Trash" />]}
      />

      <View className="flex-1 items-center justify-center">
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          allowsPictureInPicture
        />
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
