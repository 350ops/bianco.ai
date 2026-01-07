import { BlurView as _BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useRef } from 'react';
import { View, Pressable, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemeColors from '@/app/contexts/ThemeColors';
import AnimatedView from '@/components/AnimatedView';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import WebView3DModel from '@/components/WebView3DModel';
import { FEATURED_DESIGNS, FeaturedDesign } from '@/data/featuredDesigns';
import { CaptureWrapper } from '@/store/CaptureProvider';
const BlurView = Animated.createAnimatedComponent(_BlurView);

// 3D furniture models hosted on Cloudinary
// Use .glb extension for the 3D model, not the .png render
const FURNITURE_3D_MODELS = [
  'https://res.cloudinary.com/dfo58hwya/image/upload/v1767687067/Cloudinary%203D/models/steps_ftsxop.glb',
];
// Furniture images for the showcase (fallback)
const FURNITURE_IMAGES = [
  require('@/assets/img/Mueble1 Background Removed.png'),
  require('@/assets/img/Mueble2 Background Removed.png'),
  require('@/assets/img/Mueble4 Background Removed.png'),
  require('@/assets/img/Mueble5 Background Removed.png'),
  require('@/assets/img/Mueble7 Background Removed.png'),
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_WIDTH = 320;
const CAROUSEL_HEIGHT = 258;

// Custom carousel item with blur effect
interface CarouselItemProps {
  design: FeaturedDesign;
  animationValue: SharedValue<number>;
}

const CustomCarouselItem: React.FC<CarouselItemProps> = ({ design, animationValue }) => {
  const maskStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValue.value, [-10, 0, 1], [1, 0, 1]);
    return { opacity };
  }, [animationValue]);

  return (
    <Link href={`/screens/featured-design/${design.id}`} asChild>
      <Pressable style={styles.carouselItemContainer}>
        <View style={styles.carouselItemInner}>
          <Image source={design.image} style={styles.carouselImage} resizeMode="cover" />
          <View style={styles.carouselTextContainer}>
            <ThemedText className="items-center  justify-center text-center text-lg font-light text-white">
              {design.title}
            </ThemedText>
          </View>
        </View>
        <BlurView
          intensity={70}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.blurOverlay, maskStyle]}
        />
      </Pressable>
    </Link>
  );
};

// Tips for better results
const TIPS = [
  {
    id: '1',
    icon: 'Camera' as const,
    title: 'Good Lighting',
    description: 'Take photos in natural light for best results',
  },
  {
    id: '2',
    icon: 'Maximize' as const,
    title: 'Wide Angle',
    description: 'Capture the entire room in your photo',
  },
  {
    id: '3',
    icon: 'Sparkles' as const,
    title: 'Clear Space',
    description: 'Remove clutter for cleaner transformations',
  },
];

export default function ExploreScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-global py-2"
        style={{ paddingTop: insets.top + 4 }}>
        <Image
          source={require('@/assets/img/scan3D.png')}
          style={{ width: 345, height: 80 }}
          resizeMode="contain"
        />
        <View style={{ position: 'absolute', right: 16, top: insets.top + 18 }}>
          <Link href="/screens/settings" asChild>
            <Pressable className="rounded-full p-3" style={{ backgroundColor: colors.secondary }}>
              <Icon name="Settings" size={22} color={colors.text} />
            </Pressable>
          </Link>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <AnimatedView animation="fadeInUp" className="-mt3" style={{ paddingHorizontal: 8 }}>
          <Link href="/(tabs)/create" asChild>
            <Pressable className="overflow-hidden rounded-3xl">
              <LinearGradient
                colors={['#070A20', '#940060']}
                start={{ x: 0, y: -3 }}
                end={{ x: 10, y: 13 }}
                className="rounded-xl p-1"
              />
            </Pressable>
          </Link>
        </AnimatedView>

        {/* Interactive 3D Model Viewer */}
       

        {/* Before/After Demo */}
        <AnimatedView animation="fadeInUp" delay={100} className="mt-6 px-4">
          <View className="mb-3">
            <ThemedText className="text-2xl font-extrabold">See the Transformation</ThemedText>
            <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
              Drag the slider to compare before & after
            </ThemedText>
          </View>
          <BeforeAfterSlider
            beforeImage={require('@/assets/img/before.jpg')}
            afterImage={require('@/assets/img/after.jpeg')}
            width={SCREEN_WIDTH - 32}
            height={280}
            borderRadius={20}
          />
        </AnimatedView>

        <AnimatedView animation="fadeInUp" delay={50} className="mt-6">
          <View className="mb-3 px-4">
            <ThemedText className="text-lg font-bold">3D Furniture Preview</ThemedText>
            <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
              Pinch to zoom • Drag to rotate • Two fingers to pan
            </ThemedText>
          </View>
          <View
            style={{
              width: SCREEN_WIDTH,
              height: 280,
              overflow: 'hidden',
              backgroundColor: colors.isDark ? '#0B0B0D' : '#ffffff',
            }}>
            <WebView3DModel
              modelUrl={FURNITURE_3D_MODELS[0]}
              width={SCREEN_WIDTH}
              height={300}
              autoRotate
              cameraControls
              backgroundColor={colors.isDark ? '#0B0B0D' : '#ffffff'}
            />
          </View>
        </AnimatedView>

        {/* Featured Designs Carousel with Blur Parallax */}
        <AnimatedView animation="fadeInUp" delay={150} className="mt-8">
          <View className="mb-8 flex-row items-center justify-between px-global">
            <ThemedText className="text-xl font-extrabold">Get Inspired</ThemedText>
            
          </View>
          <View style={styles.carouselContainer}>
            <CaptureWrapper>
              <Carousel<FeaturedDesign>
                ref={carouselRef}
                style={styles.carousel}
                width={PAGE_WIDTH}
                height={CAROUSEL_HEIGHT}
                data={FEATURED_DESIGNS}
                mode="horizontal-stack"
                modeConfig={{
                  snapDirection: 'left',
                  stackInterval: 30,
                  scaleInterval: 0.08,
                  rotateZDeg: 0,
                }}
                onProgressChange={(_offsetProgress, absoluteProgress) => {
                  progress.value = absoluteProgress;
                }}
                renderItem={({ item: design, animationValue }) => (
                  <CustomCarouselItem design={design} animationValue={animationValue} />
                )}
                scrollAnimationDuration={800}
              />
            </CaptureWrapper>
          </View>
          <Pagination.Basic
            progress={progress}
            data={FEATURED_DESIGNS}
            dotStyle={{
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
              borderRadius: 50,
              width: 8,
              height: 8,
            }}
            activeDotStyle={{
              backgroundColor: colors.highlight,
              borderRadius: 50,
              width: 8,
              height: 8,
            }}
            containerStyle={{ gap: 8, marginTop: 12 }}
            onPress={onPressPagination}
          />
        </AnimatedView>

        {/* Tips Section */}
        <AnimatedView
          animation="fadeInUp"
          delay={250}
          className="mt-8"
          style={{ paddingHorizontal: 4 }}>
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
                  <View className="h-12 w-12 items-center justify-center rounded-full">
                    <Icon name={tip.icon} size={22} color={colors.iconAccent} />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="font-semibold">{tip.title}</ThemedText>
                    <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
                      {tip.description}
                    </ThemedText>
                  </View>
                  {tipHref && <Icon name="ChevronRight" size={18} color={colors.placeholder} />}
                </>
              );

              const itemClassName = 'flex-row items-center rounded-2xl p-4 gap-4';

              if (tipHref) {
                return (
                  <Link key={tip.id} href={tipHref} asChild>
                    <Pressable className={itemClassName}>{content}</Pressable>
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
        <AnimatedView
          animation="fadeInUp"
          delay={350}
          className="mt-8"
          style={{ paddingHorizontal: 4 }}>
          <View className="rounded-3xl  border-border   bg-gray-100 p-6">
            <ThemedText className="mb-4 text-lg font-bold">Your Activity</ThemedText>
            <View className="flex-row">
              <View className="flex-1 items-center">
                <ThemedText className="text-3xl font-bold" style={{ color: colors.accent }}>
                  0
                </ThemedText>
                <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
                  Designs Created
                </ThemedText>
              </View>
              <View className="w-px" style={{ backgroundColor: colors.border }} />
              <View className="flex-1 items-center">
                <ThemedText className="text-3xl font-bold" style={{ color: colors.accent }}>
                  0
                </ThemedText>
                <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
                  Rooms Saved
                </ThemedText>
              </View>
              <View className="w-px" style={{ backgroundColor: colors.border }} />
              <View className="flex-1 items-center">
                <ThemedText className="text-3xl font-bold" style={{ color: colors.accent }}>
                  0
                </ThemedText>
                <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
                  Favorites
                </ThemedText>
              </View>
            </View>
          </View>
        </AnimatedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  carousel: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  carouselItemInner: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  carouselImage: {
    width: '100%',
    height: 200,
  },
  carouselTextContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlay: {
    borderRadius: 16,
  },
});
