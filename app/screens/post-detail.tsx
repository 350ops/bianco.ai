import React, { useRef, useState } from 'react';
import { Image, Pressable, View, Dimensions, Text } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';

import ActionSheetThemed from '@/components/ActionSheetThemed';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import Favorite from '@/components/Favorite';
import Header, { HeaderIcon } from '@/components/Header';
import Icon from '@/components/Icon';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';

const similarImages = [
  { id: 1, source: require('@/assets/img/scify-1.jpg') },
  { id: 2, source: require('@/assets/img/scify-3.jpg') },
  { id: 3, source: require('@/assets/img/scify-4.jpg') },
  { id: 4, source: require('@/assets/img/scify-5.jpg') },
];

export default function PostScreen() {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'subject' | 'vibes'>('subject');
  const userActionsSheetRef = useRef<ActionSheetRef>(null);
  const { width } = Dimensions.get('window');

  return (
    <>
      <Header
        showBackButton
        rightComponents={[
          <HeaderIcon icon="Ellipsis" onPress={() => userActionsSheetRef.current?.show()} />,
          <Favorite />,
          <HeaderIcon icon="Download" />,
        ]}
      />

      <ThemedScroller className="!px-0 !pt-0">
        <View className="mb-4 w-full flex-row items-center px-global ">
          <Avatar size="sm" src={require('@/assets/img/user.png')} link="/screens/user-profile" />
          <View className="ml-3">
            <ThemedText className="text-base font-medium">" "</ThemedText>
            <ThemedText className="text-sm opacity-50">1h ago</ThemedText>
          </View>
        </View>
        <Image
          source={require('@/assets/img/scify-2.jpg')}
          style={{ width: '100%', height: width * 1.2 }}
          resizeMode="cover"
        />
        <View className="p-global">
          <View className="mb-2 flex-row gap-2">
            <View className="h-8 w-8 rounded-full bg-rose-500" />
            <View className="h-8 w-8 rounded-full bg-purple-900" />
            <View className="h-8 w-8 rounded-full bg-blue-900" />
          </View>
          <View className="flex-row items-center justify-between">
            <ThemedText className="mb-2 text-sm font-bold">Prompt</ThemedText>
            <Icon name="Copy" size={16} />
          </View>
          <ThemedText className="text-base opacity-60">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </ThemedText>
          <Button iconStart="Sparkles" title="Remix" className="mt-4 !rounded-xl" />
        </View>

        <View className="border-t-4 border-darker px-global py-4">
          <View className="mt-6">
            <ThemedText className="mb-4 text-2xl font-bold">Similar images</ThemedText>

            <View className="mb-4 flex-row gap-2">
              <Pressable
                onPress={() => setActiveTab('subject')}
                className={`flex-1 rounded-xl py-2 ${activeTab === 'subject' ? 'bg-text' : 'bg-secondary'}`}>
                <ThemedText
                  className={`text-center text-xs font-semibold ${activeTab === 'subject' ? '!text-background' : 'text-text'}`}>
                  By Subject
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('vibes')}
                className={`flex-1 rounded-xl py-2 ${activeTab === 'vibes' ? 'bg-text' : 'bg-secondary'}`}>
                <ThemedText
                  className={`text-center text-xs font-semibold ${activeTab === 'vibes' ? '!text-background' : 'text-text'}`}>
                  By Vibes
                </ThemedText>
              </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {similarImages.map((img) => (
                <View key={img.id} className="aspect-square w-[48%]">
                  <Image
                    source={img.source}
                    className="h-full w-full rounded-xl"
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ThemedScroller>

      <UserActionsSheet ref={userActionsSheetRef} />
    </>
  );
}

const UserActionsSheet = React.forwardRef<ActionSheetRef>((props, ref) => {
  return (
    <ActionSheetThemed gestureEnabled ref={ref}>
      <View className="p-global">
        <SheetItem icon="Image" name="Use to create image" hasArrow />
        <SheetItem icon="Video" name="Use to create video" hasArrow />
        <SheetItem icon="Edit" name="Edit" />
        <SheetItem icon="Wand2" name="Add FX" />
        <View className="my-2 h-px bg-border" />
        <SheetItem icon="Plus" name="Add to collection" />
        <View className="my-2 h-px bg-border" />
        <SheetItem icon="Share2" name="Share to Twitter" />
        <SheetItem icon="Flag" name="Report" hasArrow />
      </View>
    </ActionSheetThemed>
  );
});

const SheetItem = (props: any) => {
  return (
    <Pressable onPress={props.onPress} className="flex-row items-center py-4">
      <Icon name={props.icon} size={22} className="mr-4" />
      <ThemedText className="flex-1 text-lg">{props.name}</ThemedText>
      {props.hasArrow && <Icon name="ChevronRight" size={20} />}
    </Pressable>
  );
};
