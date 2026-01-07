import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions, Pressable, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon, { IconName } from '@/components/Icon';

const { width } = Dimensions.get('window');

interface SlideData {
  id: string;
  title: string;
  image: any;
  description: string;
  icon: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    title: 'Unleash your imagination',
    image: require('@/assets/img/kitch.png'),
    description: 'Generate stunning designs for your next project',
    icon: 'Sparkles',
  },
  {
    id: '2',
    title: 'Get personalized content',
    image: require('@/assets/img/livin.png'),
    description: 'Get personalized content based on your interests and preferences',
    icon: 'Heart',
  },
  {
    id: '3',
    title: 'Redesign your space',
    image: require('@/assets/img/bathr.png'),
    description: 'Get personalized content based on your interests and preferences',
    icon: 'Home',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={{}} className="flex-1 bg-background">
      <View className="relative flex-1 bg-background">
        <ImageBackground
          source={require('@/assets/img/welcome.jpg')}
          className="absolute left-0 top-0 h-full w-full">
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <FlatList
              className="h-full w-full"
              data={slides}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={width}
              renderItem={({ item }) => (
                <View style={{ width }} className="items-center justify-center">
                  <View className="mt-8 flex-1 items-center justify-center" style={{}}>
                    <Icon
                      name={item.icon as IconName}
                      size={30}
                      strokeWidth={1}
                      color="white"
                      className="h-20 w-20 rounded-full border border-white/40 bg-black/20"
                    />
                    <Text className="mt-6 text-center font-outfit-bold text-3xl text-white">
                      {item.title}
                    </Text>
                    <Text className="px-20 text-center text-lg text-white opacity-80">
                      {item.description}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />

            <View
              className="absolute mb-20 w-full flex-row justify-center"
              style={{ top: insets.top + 10 }}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  className={`mx-1 h-2 rounded-full ${index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                />
              ))}
            </View>

            <View
              style={{ bottom: insets.bottom }}
              className="absolute bottom-0 mb-global flex w-full flex-col space-y-2 px-6">
              <View className="flex flex-row items-center justify-center gap-2">
                <Pressable
                  onPress={() => router.push('/screens/onboarding-start')}
                  className="flex flex-1 flex-row items-center justify-center rounded-full border border-white py-4">
                  <AntDesign name="google" size={22} color="white" />
                </Pressable>
                <Pressable
                  onPress={() => router.push('/screens/login')}
                  className="flex w-1/4 flex-1 flex-row items-center justify-center rounded-full bg-white py-4">
                  <Icon name="Mail" size={20} color="black" />
                </Pressable>
                <Pressable
                  onPress={() => router.push('/screens/onboarding-start')}
                  className="flex flex-1 flex-row items-center justify-center rounded-full border border-white py-4">
                  <AntDesign name="apple" size={22} color="white" />
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
}
