import { Link, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Pressable, Image, FlatList, Alert, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useThemeColors from '@/app/contexts/ThemeColors';
import AnimatedView from '@/components/AnimatedView';
import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import { loadDesigns, deleteDesign, SavedDesign } from '@/utils/designStorage';

export default function MyDesignsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);

  const fetchDesigns = async () => {
    try {
      const savedDesigns = await loadDesigns();
      setDesigns(savedDesigns);
    } catch (error) {
      console.error('Failed to load designs:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Reload designs when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDesigns();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDesigns();
  };

  const handleDeleteDesign = (design: SavedDesign) => {
    Alert.alert(
      'Delete Design',
      'Are you sure you want to delete this design? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDesign(design.id);
              setDesigns((prev) => prev.filter((d) => d.id !== design.id));
              setSelectedDesign(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete design.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const DesignCard = ({ item, index }: { item: SavedDesign; index: number }) => (
    <AnimatedView animation="fadeInUp" delay={index * 50} className="mb-4">
      <Pressable
        onPress={() => setSelectedDesign(item)}
        onLongPress={() => handleDeleteDesign(item)}
        className="overflow-hidden rounded-2xl">
        {/* Before/After Images */}
        <View className="flex-row">
          <View className="flex-1">
            <View className="absolute left-2 top-2 z-10 rounded bg-black/60 px-2 py-1">
              <ThemedText className="text-xs text-white">Before</ThemedText>
            </View>
            <Image
              source={{ uri: item.originalImage }}
              className="aspect-square w-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <View className="absolute left-2 top-2 z-10 rounded bg-black/60 px-2 py-1">
              <ThemedText className="text-xs text-white">After</ThemedText>
            </View>
            <Image
              source={{ uri: item.resultImage }}
              className="aspect-square w-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Info */}
        <View className="p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <ThemedText className="text-base font-semibold" numberOfLines={1}>
              {item.title || 'Untitled Design'}
            </ThemedText>
            <Pressable onPress={() => handleDeleteDesign(item)} className="-mr-2 p-2" hitSlop={8}>
              <Icon name="Trash2" size={18} color={colors.placeholder} />
            </Pressable>
          </View>
          <ThemedText
            className="text-light-subtext dark:text-dark-subtext mb-1 text-sm"
            numberOfLines={2}>
            {item.prompt || 'No description'}
          </ThemedText>
          <ThemedText className="text-light-subtext dark:text-dark-subtext text-xs">
            {formatDate(item.createdAt)}
          </ThemedText>
        </View>
      </Pressable>
    </AnimatedView>
  );

  // Full screen design viewer
  if (selectedDesign) {
    return (
      <View className="flex-1 bg-black">
        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{ paddingTop: insets.top + 10 }}>
          <Pressable onPress={() => setSelectedDesign(null)} className="p-2">
            <Icon name="X" size={24} color="white" />
          </Pressable>
          <ThemedText className="font-semibold text-white">
            {selectedDesign.title || 'Design'}
          </ThemedText>
          <Pressable onPress={() => handleDeleteDesign(selectedDesign)} className="p-2">
            <Icon name="Trash2" size={22} color="#EF4444" />
          </Pressable>
        </View>
        <View className="flex-1 justify-center">
          {/* Before */}
          <View className="mb-2 px-4">
            <ThemedText className="mb-2 text-sm text-white/60">Before</ThemedText>
            <Image
              source={{ uri: selectedDesign.originalImage }}
              className="aspect-[4/3] w-full rounded-xl"
              resizeMode="cover"
            />
          </View>

          {/* After */}
          <View className="mt-4 px-4">
            <ThemedText className="mb-2 text-sm text-white/60">After</ThemedText>
            <Image
              source={{ uri: selectedDesign.resultImage }}
              className="aspect-[4/3] w-full rounded-xl"
              resizeMode="cover"
            />
          </View>
        </View>
        \].
        {/* Prompt */}
        <View className="px-4 pb-4" style={{ paddingBottom: insets.bottom + 16 }}>
          <ThemedText className="mb-1 text-xs text-white/60">Prompt</ThemedText>
          <ThemedText className="text-sm text-white">
            {selectedDesign.prompt || 'No description'}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b border-border px-global py-4"
        style={{ paddingTop: insets.top + 10 }}>
        <ThemedText className="text-2xl font-bold">My Designs</ThemedText>
        <Pressable className="rounded-full p-3" style={{ backgroundColor: colors.iconBg }}>
          <Icon name="Search" size={22} color={colors.text} />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ThemedText className="text-light-subtext dark:text-dark-subtext">Loading...</ThemedText>
        </View>
      ) : designs.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-global">
          <AnimatedView animation="fadeInUp" className="items-center">
            <View
              className="mb-6 h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.accentLight }}>
              <Icon name="Images" size={40} color={colors.iconAccent} />
            </View>
            <ThemedText className="mb-2 text-center text-2xl font-bold">No Designs Yet</ThemedText>
            <ThemedText className="text-light-subtext dark:text-dark-subtext mb-8 px-8 text-center">
              Your AI-generated room designs will appear here. Start creating to see your
              transformations!
            </ThemedText>
            <Link href="/(tabs)/create" asChild>
              <Pressable
                className="flex-row items-center gap-2 rounded-full px-8 py-4"
                style={{ backgroundColor: colors.accent }}>
                <Icon name="Plus" size={20} color="white" />
                <ThemedText className="text-lg font-semibold text-white">
                  Create First Design
                </ThemedText>
              </Pressable>
            </Link>
          </AnimatedView>
        </View>
      ) : (
        /* Designs List */
        <FlatList
          data={designs}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <DesignCard item={item} index={index} />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
