import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Pressable, ImageBackground, Text } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useThemeColors from '../contexts/ThemeColors';

import ActionSheetThemed from '@/components/ActionSheetThemed';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import Icon from '@/components/Icon';
import ThemedFooter from '@/components/ThemeFooter';
import ThemedText from '@/components/ThemedText';

export default function EditProfileScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Monthly');
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  return (
    <>
      <View className="flex-1">
        <ImageBackground
          source={require('@/assets/img/bathr.png')}
          className="flex-1 bg-background px-global">
          <View style={{ paddingTop: insets.top }} className="items-end justify-end">
            <Icon name="X" onPress={() => router.back()} size={30} color="white" />
          </View>
          <View className="flex-1 items-end justify-end">
            <View className="my-10 w-full items-center pt-10">
              <Text className="text-center font-outfit-bold text-4xl font-extrabold text-black">
                scan3D Pro
              </Text>
              <Text className="mt-1 text-center text-lg font-light text-white">
                Unlock all premium features
              </Text>
            </View>
            <View className=" mx-auto mb-6 flex-row gap-2">
              <Chip label="No ads" size="md" isSelected className="bg-rose-500" />
              <Chip label="Unlimited content access" isSelected size="md" className="bg-rose-500" />
              <Chip label="Offline access" isSelected size="md" className="bg-rose-500" />
            </View>

            <SubscriptionCard
              icon="Star"
              title="Annual"
              description="Unlock all premium features"
              price="29 EUR"
              active={selectedPlan === 'Annual'}
              onPress={() => setSelectedPlan('Annual')}
            />
            <SubscriptionCard
              icon="Trophy"
              title="Monthly"
              description="All premium features + goal tracker"
              price="2.90 EUR"
              discount="20%"
              active={selectedPlan === 'Monthly'}
              onPress={() => setSelectedPlan('Monthly')}
            />
          </View>
          <ThemedFooter className="mt-auto bg-transparent">
            <Text className="mb-4 text-center text-sm font-light text-white">
              1 month free trial then 2.90 EUR/month
            </Text>
            <Button
              onPress={() => actionSheetRef.current?.show()}
              className="!bg-highlight"
              textClassName="!text-white"
              size="large"
              rounded="full"
              title="Upgrade to plus"
            />
          </ThemedFooter>
        </ImageBackground>
      </View>
      <ActionSheetThemed
        gestureEnabled
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 10,
        }}
        ref={actionSheetRef}>
        <View className="items-center px-6 pt-10">
          <Icon name="Check" size={24} className="mb-6 h-20 w-20 rounded-full bg-background" />
          <ThemedText className="text-4xl font-semibold">All setup</ThemedText>
          <ThemedText className="mb-32 mt-2 px-14 text-center text-lg font-light">
            Hope you are satisfied. We will update you for the next subscription date.
          </ThemedText>
          <Button
            onPress={() => actionSheetRef.current?.hide()}
            className="!bg-highlight !px-10"
            textClassName="!text-white"
            size="large"
            rounded="full"
            title="Upgrade to plus"
          />
        </View>
      </ActionSheetThemed>
    </>
  );
}

const SubscriptionCard = (props: any) => {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={props.onPress}
      className={`relative mb-2 flex-row items-center rounded-2xl border bg-black/50 ${props.active ? 'border-highlight' : ' border-white/20'}`}>
      <View className="flex-1 flex-row  items-center justify-start px-6 py-6">
        {props.icon && (
          <Icon
            name="Check"
            strokeWidth={3}
            size={18}
            color={props.active ? 'white' : 'transparent'}
            className={`mr-3 h-8 w-8 rounded-full border ${props.active ? 'border-highlight bg-highlight' : 'border-border bg-white/10'}`}
          />
        )}

        <Text className="text-xl font-semibold text-white">{props.title}</Text>
        {props.discount && (
          <ThemedText className="ml-2 rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold  text-highlight">
            {props.discount} off
          </ThemedText>
        )}
        <Text className="ml-auto  text-lg text-white">{props.price}</Text>
      </View>
    </Pressable>
  );
};

const CheckItem = (props: any) => {
  return (
    <View className="my-3 flex-row items-center">
      <Icon
        name="Check"
        strokeWidth={3}
        size={15}
        color={props.active ? 'white' : 'transparent'}
        className={`mr-3 h-7 w-7 rounded-full ${props.active ? 'bg-lime-500/20' : 'bg-transparent'}`}
      />
      <ThemedText className="text-xl font-semibold">{props.title}</ThemedText>
    </View>
  );
};
