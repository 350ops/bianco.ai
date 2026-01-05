import React from 'react';
import { View, Pressable, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import AnimatedView from '@/components/AnimatedView';
import useThemeColors from '@/app/contexts/ThemeColors';
import { FEATURED_DESIGNS } from '@/app/data/featuredDesigns';

// Tips for better results
const TIPS = [
    { id: '1', icon: 'Camera' as const, title: 'Good Lighting', description: 'Take photos in natural light for best results' },
    { id: '2', icon: 'Maximize' as const, title: 'Wide Angle', description: 'Capture the entire room in your photo' },
    { id: '3', icon: 'Sparkles' as const, title: 'Clear Space', description: 'Remove clutter for cleaner transformations' },
];

export default function ExploreScreen() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View 
                className="flex-row items-center justify-between px-global py-4" 
                style={{ paddingTop: insets.top + 10 }}
            >
                <View>
                    <ThemedText className="text-2xl font-bold">Welcome Back</ThemedText>
                    <ThemedText className="text-light-subtext dark:text-dark-subtext">Let's transform your space</ThemedText>
                </View>
                <Link href="/screens/settings" asChild>
                    <Pressable className="p-3 rounded-full" style={{ backgroundColor: colors.iconBg }}>
                        <Icon name="Settings" size={22} color={colors.text} />
                    </Pressable>
                </Link>
            </View>

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Card */}
                <AnimatedView animation="fadeInUp" className="mt-4" style={{ paddingHorizontal: 4 }}>
                    <Link href="/(tabs)/create" asChild>
                        <Pressable className="bg-green-900 rounded-3xl overflow-hidden">
                            <View className="p-6">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Icon name="Sparkles" size={20} color="white" />
                                    <ThemedText className="text-white font-semibold">novaHogar</ThemedText>
                                </View>
                                <ThemedText className="text-white text-2xl font-bold mb-2">
                                    Start Transforming!
                                </ThemedText>
                                <ThemedText className="text-white/80 mb-4">
                                    Upload a photo and get a redesign of your space in seconds
                                </ThemedText>
                                <View className="flex-row items-center gap-2">
                                    <View className="px-4 py-2 rounded-full" style={{ backgroundColor: '#FFF3D6' }}>
                                        <ThemedText className="text-black font-semibold">Start Now</ThemedText>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    </Link>
                </AnimatedView>

                {/* Featured Designs */}
                <AnimatedView animation="fadeInUp" delay={100} className="mt-8">
                    <View className="flex-row items-center justify-between px-global mb-4">
                        <ThemedText className="text-lg font-bold">Get Inspired</ThemedText>
                        <Pressable>
                            <ThemedText className="font-medium" style={{ color: colors.accent }}>See All</ThemedText>
                        </Pressable>
                    </View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
                    >
                        {FEATURED_DESIGNS.map((design) => (
                            <Link key={design.id} href={`/screens/featured-design/${design.id}`} asChild>
                                <Pressable className="w-64">
                                <View className="rounded-2xl overflow-hidden">
                                    <Image 
                                        source={design.image} 
                                        className="w-full h-40"
                                        resizeMode="cover"
                                    />
                                </View>
                                <ThemedText className="font-semibold mt-2">{design.title}</ThemedText>
                                    <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                                        {design.style}
                                    </ThemedText>
                            </Pressable>
                            </Link>
                        ))}
                    </ScrollView>
                </AnimatedView>

                {/* Tips Section */}
                <AnimatedView animation="fadeInUp" delay={200} className="mt-8" style={{ paddingHorizontal: 4 }}>
                    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                        <ThemedText className="text-3xl font-black">Tips for Better Results</ThemedText>
                    </View>
                    <View className="gap-3" style={{ paddingHorizontal: 4 }}>
                        {TIPS.map((tip) => {
                            const tipHref =
                                tip.id === '1'
                                    ? '/screens/lighting-tips'
                                    : tip.id === '2'
                                    ? '/screens/wide-angle-tips'
                                    : tip.id === '3'
                                    ? '/screens/clear-space-tips'
                                    : null;
                            const content = (
                                <>
                                    <View className="w-12 h-12 rounded-full items-center justify-center">
                                        <Icon name={tip.icon} size={22} color={colors.iconAccent} />
                                    </View>
                                    <View className="flex-1">
                                        <ThemedText className="font-semibold">{tip.title}</ThemedText>
                                        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                                            {tip.description}
                                        </ThemedText>
                                    </View>
                                    {tipHref && <Icon name="ChevronRight" size={18} color={colors.placeholder} />}
                                </>
                            );

                            const itemClassName = "flex-row items-center rounded-2xl p-4 gap-4";

                            if (tipHref) {
                                return (
                                    <Link key={tip.id} href={tipHref} asChild>
                                        <Pressable className={itemClassName}>
                                            {content}
                                        </Pressable>
                                    </Link>
                                );
                            }

                            return (
                                <View key={tip.id} className={itemClassName}>
                                    {content}
                                </View>
                            );
                        })}
                    </View>
                </AnimatedView>

                {/* Stats Section */}
                <AnimatedView animation="fadeInUp" delay={300} className="mt-8" style={{ paddingHorizontal: 4 }}>
                    <View className="bg-gray-100  border-border   rounded-3xl p-6">
                        <ThemedText className="text-lg font-bold mb-4">Your Activity</ThemedText>
                        <View className="flex-row">
                            <View className="flex-1 items-center">
                                <ThemedText className="text-3xl font-bold" style={{ color: colors.accent }}>0</ThemedText>
                                <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">Designs Created</ThemedText>
                            </View>
                            <View className="w-px" style={{ backgroundColor: colors.border }} />
                            <View className="flex-1 items-center">
                                <ThemedText className="text-3xl font-bold" style={{ color: colors.accent }}>0</ThemedText>
                                <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">Rooms Saved</ThemedText>
                            </View>
                            <View className="w-px" style={{ backgroundColor: colors.border }} />
                            <View className="flex-1 items-center">
                                <ThemedText className="text-3xl font-bold" style={{ color: colors.accent }}>0</ThemedText>
                                <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">Favorites</ThemedText>
                            </View>
                        </View>
                    </View>
                </AnimatedView>
            </ScrollView>
        </View>
    );
}
