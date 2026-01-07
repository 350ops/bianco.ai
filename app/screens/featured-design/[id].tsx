import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Image, Pressable } from 'react-native';

import useThemeColors from '@/app/contexts/ThemeColors';
import { Chip } from '@/components/Chip';
import Header from '@/components/Header';
import { Placeholder } from '@/components/Placeholder';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import { getFeaturedDesign } from '@/data/featuredDesigns';

export default function FeaturedDesignScreen() {
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ id?: string }>();
  const design = getFeaturedDesign(params.id);

  if (!design) {
    return (
      <View className="flex-1 bg-background">
        <Header showBackButton title="Inspiration" />
        <Placeholder
          title="Design not found"
          subtitle="Pick another inspiration card to view the details."
          button="Back to Explore"
          href="/(tabs)/index"
          className="flex-1"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Header showBackButton title={design.title} />
      <ThemedScroller className="!px-0 !pt-0">
        <Image source={design.image} className="h-64 w-full" resizeMode="cover" />

        <View className="px-global pb-10 pt-4">
          <View className="flex-row items-center justify-between">
            <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
              {design.room}
            </ThemedText>
            <View className="rounded-full bg-secondary px-3 py-1">
              <ThemedText className="text-xs font-semibold">{design.style}</ThemedText>
            </View>
          </View>

          <ThemedText className="mt-3 text-lg font-bold">Look and Feel</ThemedText>
          <ThemedText className="text-light-subtext dark:text-dark-subtext mt-2 text-sm">
            {design.description}
          </ThemedText>

          {design.tags.length > 0 && (
            <View className="mt-4 flex-row flex-wrap gap-2">
              {design.tags.map((tag) => (
                <Chip key={tag} label={tag} size="sm" />
              ))}
            </View>
          )}

          <View className="mt-6">
            <ThemedText className="mb-3 text-lg font-bold">Key Elements</ThemedText>
            <View className="gap-2">
              {design.keyElements.map((element) => (
                <View key={element} className="flex-row items-start gap-2">
                  <View
                    className="mt-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                  />
                  <ThemedText className="flex-1 text-sm">{element}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-6">
            <ThemedText className="mb-3 text-lg font-bold">Palette</ThemedText>
            <View className="flex-row gap-3">
              {design.palette.map((color) => (
                <View
                  key={color}
                  className="h-10 w-10 rounded-full border"
                  style={{ backgroundColor: color, borderColor: colors.border }}
                />
              ))}
            </View>
          </View>

          <Link href="/(tabs)/create" asChild>
            <Pressable className="mt-8 items-center rounded-full bg-text py-4">
              <ThemedText className="font-semibold text-white">Use this style</ThemedText>
            </Pressable>
          </Link>
        </View>
      </ThemedScroller>
    </View>
  );
}
