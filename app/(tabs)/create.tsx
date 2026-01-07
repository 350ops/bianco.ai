import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { File, Paths } from 'expo-file-system/next';
import * as Haptics from 'expo-haptics';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import Reanimated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { editImageWithOpenAI } from '@/lib/openai';

// Safely check if liquid glass is available (iOS 26+)
let supportsNativeLiquidGlass = false;
let GlassView: any = View;
try {
  const glassEffect = require('expo-glass-effect');
  if (Platform.OS === 'ios' && glassEffect.isLiquidGlassAvailable?.()) {
    supportsNativeLiquidGlass = true;
    GlassView = glassEffect.GlassView;
  }
} catch (e) {
  // expo-glass-effect not available
}

import useThemeColors from '@/app/contexts/ThemeColors';
import AnimatedBottomSheet from '@/components/AnimatedBottomSheet';
import AnimatedView from '@/components/AnimatedView';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { Button } from '@/components/Button';
import Icon, { IconName } from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import { saveDesign } from '@/utils/designStorage';
import { parallaxLayout } from '@/utils/parallaxLayout';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH - 80;
const TUTORIAL_CAROUSEL_HEIGHT = 240;
const AnimatedBlurView = Reanimated.createAnimatedComponent(BlurView);

// API Key from environment variable
const DEFAULT_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

const toRgba = (hexColor: string, alpha: number) => {
  if (!hexColor.startsWith('#')) {
    return hexColor;
  }

  let hex = hexColor.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (hex.length !== 6) {
    return hexColor;
  }

  const intValue = parseInt(hex, 16);
  const red = (intValue >> 16) & 255;
  const green = (intValue >> 8) & 255;
  const blue = intValue & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

// Dark green color matching the hero card (bg-green-900)
const CARD_GREEN = '#14532d';
const PASTEL_YELLOW = '#FFF3D6';

const createLiquidGlassStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    cardOuter: {
      borderRadius: 32,
      overflow: 'hidden',
      shadowColor: colors.isDark ? 'rgba(0,0,0,0.6)' : 'rgba(20, 83, 45, 0.3)',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
    },
    cardBlur: {
      borderRadius: 32,
      borderWidth: 0,
      borderColor: 'transparent',
      overflow: 'hidden',
      backgroundColor: colors.isDark ? colors.secondary : CARD_GREEN,
    },
    topHighlight: {
      position: 'absolute',
      top: 0,
      left: 20,
      right: 20,
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 1,
    },
    cardContent: {
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 24,
      alignItems: 'center',
    },
    iconContainer: {
      marginBottom: 24,
      borderRadius: 28,
      overflow: 'hidden',
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
    },
    iconBlur: {
      width: 100,
      height: 100,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      overflow: 'hidden',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: 28,
      paddingHorizontal: 8,
    },
    actionButton: {
      borderRadius: 50,
      overflow: 'hidden',
      width: '100%',
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    buttonBlur: {
      borderRadius: 50,
      borderWidth: 0,
      backgroundColor: colors.isDark ? colors.secondary : PASTEL_YELLOW,
      overflow: 'hidden',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
      gap: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.isDark ? '#FFFFFF' : '#14532d',
      letterSpacing: 0.5,
    },
    skipText: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '500',
    },
  });

type ChangeConfidence = 'locked' | 'creative';
type AccuracyMode = 'strict' | 'balanced';
type ChipKey = 'walls' | 'floor' | 'sofa' | 'table' | 'lighting';
type QuickPickTab = 'popular' | 'recent' | 'saved';

// Step Badge Component - Based on Figma design (node 3528:41)
// Dark gray circle with white number inside
const StepBadge = ({ number }: { number: number }) => (
  <View
    className="h-8 w-8 items-center justify-center rounded-full"
    style={{ backgroundColor: '#9B744D' }}>
    <ThemedText className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
      {number}
    </ThemedText>
  </View>
);

// Liquid Glass Card Component - Uses native GlassView on iOS 26+, falls back to BlurView
interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: object;
  cardStyle?: 'regular' | 'clear';
  colors: ReturnType<typeof useThemeColors>;
  liquidGlassStyles: ReturnType<typeof createLiquidGlassStyles>;
  glassGradients: {
    card: [string, string];
    icon: [string, string];
    button: [string, string];
    paginationActive: string;
    paginationInactive: string;
  };
}

const LiquidGlassCard = ({
  children,
  style,
  cardStyle = 'regular',
  colors,
  liquidGlassStyles,
  glassGradients,
}: LiquidGlassCardProps) => {
  if (supportsNativeLiquidGlass) {
    // Use native iOS 26+ GlassView with green background
    return (
      <View style={[liquidGlassStyles.cardOuter, style]}>
        <GlassView
          style={liquidGlassStyles.cardBlur}
          glassEffectStyle={cardStyle}
          tintColor={colors.isDark ? undefined : CARD_GREEN}
          isInteractive>
          {/* Top highlight line */}
          <View style={liquidGlassStyles.topHighlight} />
          {children}
        </GlassView>
      </View>
    );
  }

  // Fallback - solid green background (no blur needed)
  return (
    <View style={[liquidGlassStyles.cardOuter, style]}>
      <View style={liquidGlassStyles.cardBlur}>
        {/* Top highlight line */}
        <View style={liquidGlassStyles.topHighlight} />
        {children}
      </View>
    </View>
  );
};

// Liquid Glass Icon Component
interface LiquidGlassIconProps {
  icon: string;
  size?: number;
  colors: ReturnType<typeof useThemeColors>;
  liquidGlassStyles: ReturnType<typeof createLiquidGlassStyles>;
  glassGradients: {
    card: [string, string];
    icon: [string, string];
    button: [string, string];
    paginationActive: string;
    paginationInactive: string;
  };
}

const LiquidGlassIcon = ({ icon, size = 56, colors, liquidGlassStyles }: LiquidGlassIconProps) => {
  // Icon color is white on green background
  const iconColor = colors.isDark ? '#FFFFFF' : '#FFFFFF';

  if (supportsNativeLiquidGlass) {
    return (
      <View style={liquidGlassStyles.iconContainer}>
        <GlassView style={liquidGlassStyles.iconBlur} glassEffectStyle="regular">
          <Icon name={icon as any} size={size} color={iconColor} />
        </GlassView>
      </View>
    );
  }

  return (
    <View style={liquidGlassStyles.iconContainer}>
      <View style={liquidGlassStyles.iconBlur}>
        <Icon name={icon as any} size={size} color={iconColor} />
      </View>
    </View>
  );
};

// Liquid Glass Button Component
interface LiquidGlassButtonProps {
  onPress: () => void;
  title: string;
  subtitle?: string;
  colors: ReturnType<typeof useThemeColors>;
  liquidGlassStyles: ReturnType<typeof createLiquidGlassStyles>;
  glassGradients: {
    card: [string, string];
    icon: [string, string];
    button: [string, string];
    paginationActive: string;
    paginationInactive: string;
  };
}

const LiquidGlassButton = ({
  onPress,
  title,
  subtitle,
  colors,
  liquidGlassStyles,
}: LiquidGlassButtonProps) => {
  // Button text/icon color: green on pastel yellow (light), white on dark
  const buttonTextColor = colors.isDark ? '#FFFFFF' : CARD_GREEN;
  const subtitleColor = colors.isDark ? 'rgba(255,255,255,0.7)' : 'rgba(20, 83, 45, 0.7)';

  if (supportsNativeLiquidGlass) {
    return (
      <Pressable onPress={onPress} style={liquidGlassStyles.actionButton}>
        <GlassView
          style={liquidGlassStyles.buttonBlur}
          glassEffectStyle="regular"
          tintColor={colors.isDark ? undefined : PASTEL_YELLOW}
          isInteractive>
          <View style={liquidGlassStyles.buttonContent}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ThemedText style={[liquidGlassStyles.buttonText, { color: buttonTextColor }]}>
                  {title}
                </ThemedText>
                <Icon name="ArrowRight" size={18} color={buttonTextColor} />
              </View>
              {subtitle && (
                <ThemedText style={{ fontSize: 12, color: subtitleColor }}>{subtitle}</ThemedText>
              )}
            </View>
          </View>
        </GlassView>
      </Pressable>
    );
  }

  // Fallback - solid pastel yellow button
  return (
    <Pressable onPress={onPress} style={liquidGlassStyles.actionButton}>
      <View style={liquidGlassStyles.buttonBlur}>
        <View style={liquidGlassStyles.buttonContent}>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ThemedText style={[liquidGlassStyles.buttonText, { color: buttonTextColor }]}>
                {title}
              </ThemedText>
              <Icon name="ArrowRight" size={18} color={buttonTextColor} />
            </View>
            {subtitle && (
              <ThemedText style={{ fontSize: 12, color: subtitleColor }}>{subtitle}</ThemedText>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function CreateScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const liquidGlassStyles = useMemo(() => createLiquidGlassStyles(colors), [colors]);
  const glassGradients = useMemo(() => {
    // Pastel yellow for card backgrounds
    const pastelYellow = '#FFF3D6';
    const pastelYellowLight = '#FFFBF0';

    const accentSoft = toRgba(colors.accent, colors.isDark ? 0.25 : 0.2);
    const backgroundSoft = toRgba(colors.bg, colors.isDark ? 0.92 : 0.85);
    const textSoft = toRgba(colors.text, colors.isDark ? 0.12 : 0.18);

    return {
      card: (colors.isDark
        ? [backgroundSoft, 'rgba(42, 42, 42, 0.75)']
        : [pastelYellowLight, pastelYellow]) as [string, string],
      icon: (colors.isDark
        ? [textSoft, toRgba(colors.text, 0.04)]
        : ['rgba(255, 243, 214, 0.8)', 'rgba(255, 229, 160, 0.6)']) as [string, string],
      button: (colors.isDark
        ? ['rgba(42, 42, 42, 0.9)', 'rgba(26, 26, 26, 0.9)']
        : ['rgba(255, 243, 214, 0.95)', 'rgba(255, 229, 160, 0.9)']) as [string, string],
      paginationActive: colors.isDark ? '#FFE5A0' : '#484848',
      paginationInactive: colors.isDark ? toRgba(colors.text, 0.25) : 'rgba(72, 72, 72, 0.25)',
    };
  }, [colors]);

  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [image, setImage] = useState<string | null>(null);
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  // Design customization options
  const [selectedWall, setSelectedWall] = useState('');
  const [selectedFlooring, setSelectedFlooring] = useState('');
  const [selectedFlooringSampleId, setSelectedFlooringSampleId] = useState<string | null>(null);
  const [selectedSofaStyle, setSelectedSofaStyle] = useState('');
  const [selectedTableStyle, setSelectedTableStyle] = useState('');
  const [selectedLightingStyle, setSelectedLightingStyle] = useState('');
  const [selectedProductRefs, setSelectedProductRefs] = useState<Record<ChipKey, string[]>>({
    walls: [],
    floor: [],
    sofa: [],
    table: [],
    lighting: [],
  });

  const [changeConfidence, setChangeConfidence] = useState<ChangeConfidence>('locked');
  const [accuracyMode, setAccuracyMode] = useState<AccuracyMode>('strict');
  const [variationCount, setVariationCount] = useState(1);
  const [selectedChips, setSelectedChips] = useState<ChipKey[]>([]);
  const [activeChip, setActiveChip] = useState<ChipKey | null>(null);
  const [showChipNudge, setShowChipNudge] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [quickPickTab, setQuickPickTab] = useState<QuickPickTab>('popular');
  const [creativePreset, setCreativePreset] = useState('');
  const [lockMoreHint, setLockMoreHint] = useState(false);

  // Picker modal states
  const [showWallPicker, setShowWallPicker] = useState(false);
  const [showFlooringPicker, setShowFlooringPicker] = useState(false);
  const [showSofaPicker, setShowSofaPicker] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showLightingPicker, setShowLightingPicker] = useState(false);
  const [showRoomTypePicker, setShowRoomTypePicker] = useState(false);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  // Room type
  const [roomType, setRoomType] = useState<string>('');

  // Room type options
  const ROOM_TYPE_OPTIONS = [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Bathroom',
    'Dining Room',
    'Home Office',
    'Entryway',
    'Hallway',
    'Nursery',
    'Guest Room',
  ];

  // User uploaded images state
  // User uploaded images state (furniture, floors, etc.)
  const [uploadedImages, setUploadedImages] = useState<
    { id: string; uri: string; name: string; category: ChipKey }[]
  >([]);

  // Flooring reference images
  const flooringReferenceItems = [
    { id: 'denver', name: 'Denver', image: require('@/assets/img/denver.jpeg') },
    { id: 'tholos', name: 'Tholos', image: require('@/assets/img/Tholos.jpeg') },
    { id: 'nivala', name: 'Nivala', image: require('@/assets/img/nivala.jpeg') },
    { id: 'merida', name: 'Merida', image: require('@/assets/img/merida.jpeg') },
  ];

  const selectedFlooringSample = flooringReferenceItems.find(
    (item) => item.id === selectedFlooringSampleId
  );

  // Available furniture reference images
  const furnitureReferenceItems = [
    { id: 'mobile', name: 'Media Console', image: require('@/assets/img/mobile.jpg') },
    { id: 'silla', name: 'Accent Chair', image: require('@/assets/img/silla.jpg') },
    {
      id: 'mueble1',
      name: 'Sideboard',
      image: require('@/assets/img/Mueble1 Background Removed.png'),
    },
    {
      id: 'mueble2',
      name: 'Cabinet',
      image: require('@/assets/img/Mueble2 Background Removed.png'),
    },
    {
      id: 'mueble4',
      name: 'Bookshelf',
      image: require('@/assets/img/Mueble4 Background Removed.png'),
    },
    {
      id: 'mueble5',
      name: 'Console Table',
      image: require('@/assets/img/Mueble5 Background Removed.png'),
    },
    // West Elm Sofas
    {
      id: 'westelm-haven',
      name: 'West Elm Haven Sofa',
      image: require('@/assets/img/westelm-haven-sofa.jpg'),
    },
    {
      id: 'westelm-harmony',
      name: 'West Elm Harmony Modular',
      image: require('@/assets/img/westelm-harmony-sofa.jpg'),
    },
    {
      id: 'westelm-andes',
      name: 'West Elm Andes Mid-Century',
      image: require('@/assets/img/westelm-andes-sofa.jpg'),
    },
    {
      id: 'westelm-axel',
      name: 'West Elm Axel Leather',
      image: require('@/assets/img/westelm-axel-leather-sofa.jpg'),
    },
  ];

  // Design options
  const WALL_OPTIONS = [
    'Plain White',
    'Soft Gray',
    'Warm Beige',
    'Light Blue',
    'Sage Green',
    'Floral Wallpaper',
    'Geometric Wallpaper',
    'Marble Effect',
    'Exposed Brick',
    'Wood Paneling',
    'Textured Plaster',
    'Accent Wall (Dark)',
  ];

  const FLOORING_OPTIONS = [
    'Hardwood Oak',
    'Hardwood Walnut',
    'Light Maple Wood',
    'Dark Mahogany',
    'White Marble',
    'Gray Marble',
    'Ceramic Tiles',
    'Porcelain Tiles',
    'Herringbone Parquet',
    'Concrete Polished',
    'Natural Stone',
    'Luxury Vinyl Plank',
  ];

  const SOFA_OPTIONS = [
    'Low-profile neutral fabric',
    'Curved boucle modular',
    'Soft linen sectional',
    'Warm leather sofa',
    'Slim mid-century profile',
    // West Elm inspired styles
    'Haven deep-seat sofa (West Elm)',
    'Harmony modular sectional (West Elm)',
    'Andes mid-century sofa (West Elm)',
    'Axel leather industrial sofa (West Elm)',
  ];

  const TABLE_OPTIONS = [
    'Round oak coffee table',
    'Stone slab coffee table',
    'Glass top table',
    'Nested wood tables',
    'Minimal black metal table',
  ];

  const LIGHTING_OPTIONS = [
    'Soft warm ambient lighting',
    'Statement pendant',
    'Layered floor lamps',
    'Recessed ceiling lights',
    'Sculptural lamp',
  ];

  type ReferenceEntry = {
    category: ChipKey;
    label: string;
    image: { uri: string; name: string; type: string };
  };

  const CHIP_LABELS: Record<ChipKey, string> = {
    walls: 'Walls',
    floor: 'Floor',
    sofa: 'Sofa',
    table: 'Table',
    lighting: 'Lighting',
  };

  const CHIP_ORDER: ChipKey[] = ['floor', 'walls', 'sofa', 'table', 'lighting'];

  const DEFAULT_CHIP_DESCRIPTIONS: Record<ChipKey, string> = {
    floor: 'a warm wood or stone finish',
    walls: 'a soft neutral paint or subtle wallpaper',
    sofa: 'a low-profile neutral fabric sofa',
    table: 'a simple coffee table with natural materials',
    lighting: 'soft, warm ambient lighting',
  };

  const WALL_COLOR_MAP: Record<string, string> = {
    'Plain White': '#F5F5F0',
    'Soft Gray': '#D7D9DD',
    'Warm Beige': '#D9C8B2',
    'Light Blue': '#C9D9E9',
    'Sage Green': '#B8C4B1',
    'Floral Wallpaper': '#E7D7DC',
    'Geometric Wallpaper': '#D9D3CC',
    'Marble Effect': '#E8E6E3',
    'Exposed Brick': '#B7654D',
    'Wood Paneling': '#C7A47B',
    'Textured Plaster': '#DAD2C8',
    'Accent Wall (Dark)': '#2F2F2F',
  };

  const getChipSelectionText = (chip: ChipKey) => {
    switch (chip) {
      case 'floor':
        return selectedFlooring || DEFAULT_CHIP_DESCRIPTIONS.floor;
      case 'walls':
        return selectedWall || DEFAULT_CHIP_DESCRIPTIONS.walls;
      case 'sofa':
        return selectedSofaStyle || DEFAULT_CHIP_DESCRIPTIONS.sofa;
      case 'table':
        return selectedTableStyle || DEFAULT_CHIP_DESCRIPTIONS.table;
      case 'lighting':
        return selectedLightingStyle || DEFAULT_CHIP_DESCRIPTIONS.lighting;
      default:
        return '';
    }
  };

  const hasReferenceForChip = (chip: ChipKey) => {
    if (chip === 'floor') return Boolean(selectedFlooringSampleId);
    const productRefs = selectedProductRefs[chip]?.length ?? 0;
    const uploads = uploadedImages.some((img) => img.category === chip);
    return productRefs > 0 || uploads;
  };

  const referenceEntries = useMemo<ReferenceEntry[]>(() => {
    const entries: ReferenceEntry[] = [];

    if (selectedFlooringSample) {
      const asset = Image.resolveAssetSource(selectedFlooringSample.image);
      entries.push({
        category: 'floor',
        label: selectedFlooringSample.name,
        image: {
          uri: asset.uri,
          name: `${selectedFlooringSample.id}.jpeg`,
          type: 'image/jpeg',
        },
      });
    }

    CHIP_ORDER.forEach((chip) => {
      if (!selectedProductRefs[chip]?.length) return;
      selectedProductRefs[chip].forEach((itemId) => {
        const item = furnitureReferenceItems.find((i) => i.id === itemId);
        if (!item) return;
        const asset = Image.resolveAssetSource(item.image);
        entries.push({
          category: chip,
          label: item.name,
          image: {
            uri: asset.uri,
            name: `${item.id}.png`,
            type: 'image/png',
          },
        });
      });
    });

    uploadedImages.forEach((uploadedImg) => {
      entries.push({
        category: uploadedImg.category,
        label: uploadedImg.name,
        image: {
          uri: uploadedImg.uri,
          name: uploadedImg.name,
          type: 'image/jpeg',
        },
      });
    });

    return entries;
  }, [selectedFlooringSample, selectedProductRefs, uploadedImages, furnitureReferenceItems]);

  const buildConstraintsText = () => {
    const lines: string[] = [];

    lines.push('Preserve the original room geometry, layout, and architecture.');
    lines.push('Do not change wall positions, ceiling height, doors, windows, or openings.');
    lines.push('Maintain the original camera angle, lens perspective, and framing.');
    lines.push('Keep the natural light direction and intensity consistent with the input.');
    lines.push('No people, no pets, no text or watermarks, and no visible brand logos.');

    if (changeConfidence === 'locked') {
      const chipList = selectedChips.length
        ? selectedChips.map((chip) => CHIP_LABELS[chip].toLowerCase()).join(', ')
        : 'the selected elements';
      lines.push(`Locked edit: only change ${chipList}. Keep everything else identical.`);
      lines.push('Treat non-selected regions as protected masks. Do not alter them.');
      if (accuracyMode === 'strict') {
        lines.push('Strict accuracy: zero creative liberties beyond the selected changes.');
      } else {
        lines.push('Balanced accuracy: allow subtle supporting tweaks only when necessary.');
      }
    } else {
      lines.push(
        'Creative concept: feel free to redesign more broadly while preserving the architecture.'
      );
    }

    lines.push(
      'Photorealistic, natural materials, correct perspective, consistent lighting and shadows.'
    );
    return lines.join(' ');
  };

  const buildChangeDetailsText = () => {
    if (!selectedChips.length) return '';

    const lines: string[] = ['Change details:'];
    selectedChips.forEach((chip) => {
      const selection = getChipSelectionText(chip);
      lines.push(`- ${CHIP_LABELS[chip]}: ${selection}.`);
    });

    if (changeConfidence === 'locked') {
      const missingRefs = selectedChips.filter((chip) => !hasReferenceForChip(chip));
      if (missingRefs.length > 0) {
        const missingLabels = missingRefs.map((chip) => CHIP_LABELS[chip].toLowerCase()).join(', ');
        lines.push(
          `If no product reference is provided for ${missingLabels}, match only the material or color family.`
        );
      }
    }

    if (changeConfidence === 'creative' && creativePreset) {
      lines.push(`Creative preset: ${creativePreset}.`);
    }

    return lines.join('\n');
  };

  const buildReferenceText = (refs: ReferenceEntry[]) => {
    if (!refs.length) return '';
    const lines: string[] = [];

    CHIP_ORDER.forEach((chip) => {
      const items = refs.filter((ref) => ref.category === chip);
      if (!items.length) return;
      const itemLabels = items
        .slice(0, 3)
        .map((item) => item.label)
        .join(', ');
      lines.push(`References for ${CHIP_LABELS[chip].toLowerCase()}: ${itemLabels}.`);
    });

    if (changeConfidence === 'locked') {
      lines.push(
        'When a reference is provided, match it closely and treat it as an exact constraint.'
      );
    } else {
      lines.push('Use provided references as inspiration only, not exact copies.');
    }

    return lines.join(' ');
  };

  const buildPromptFromSelections = () => {
    const roomLabel = roomType ? roomType.toLowerCase() : 'room';
    const promptSections = [
      `Redesign this ${roomLabel} using the provided reference images.`,
      buildConstraintsText(),
      buildChangeDetailsText(),
      buildReferenceText(referenceEntries),
      'Keep results high-end, editorial, and realistic. Avoid clutter. Do not hallucinate extra doors or windows.',
    ].filter(Boolean);

    return promptSections.join('\n\n');
  };

  const assembledPrompt = useMemo(
    () => buildPromptFromSelections(),
    [
      changeConfidence,
      accuracyMode,
      selectedChips,
      selectedWall,
      selectedFlooring,
      selectedFlooringSampleId,
      selectedSofaStyle,
      selectedTableStyle,
      selectedLightingStyle,
      selectedProductRefs,
      uploadedImages,
      creativePreset,
      roomType,
    ]
  );

  const activeResultImage = resultImages[activeResultIndex] || null;

  useEffect(() => {
    if (changeConfidence === 'creative') {
      setVariationCount(4);
    } else {
      setVariationCount(1);
      setAccuracyMode('strict');
    }
  }, [changeConfidence]);

  useEffect(() => {
    if (!selectedChips.length) {
      setActiveChip(null);
      return;
    }
    if (!activeChip || !selectedChips.includes(activeChip)) {
      setActiveChip(selectedChips[selectedChips.length - 1]);
    }
  }, [selectedChips, activeChip]);

  useEffect(() => {
    if (!lockMoreHint) return;
    const timer = setTimeout(() => setLockMoreHint(false), 3000);
    return () => clearTimeout(timer);
  }, [lockMoreHint]);

  // Progress bar animation for processing (60 seconds)
  useEffect(() => {
    if (loading) {
      setProgress(0);
      progressAnim.setValue(0);

      // Animate progress over 60 seconds with easing (faster at start, slower near end)
      const duration = 60000; // 60 seconds
      const startTime = Date.now();

      progressInterval.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const linearProgress = Math.min(elapsed / duration, 0.95); // Cap at 95%
        // Ease out - starts fast, slows down near end
        const easedProgress = 1 - Math.pow(1 - linearProgress, 2);
        setProgress(Math.round(easedProgress * 100));
        progressAnim.setValue(easedProgress);
      }, 100);
    } else {
      // Complete the progress when done
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      if (resultImages.length > 0) {
        setProgress(100);
        progressAnim.setValue(1);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [loading, resultImages, progressAnim]);

  // Convert image to JPEG format (OpenAI only accepts PNG, JPEG, WEBP)
  const convertImageToJpeg = async (uri: string): Promise<string> => {
    try {
      console.log('🔄 Converting image to JPEG:', uri);
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [], // No transformations, just convert format
        {
          compress: 0.9,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      console.log('✅ Converted to:', manipulatedImage.uri);
      return manipulatedImage.uri;
    } catch (error) {
      console.error('❌ Error converting image:', error);
      return uri; // Return original if conversion fails
    }
  };

  const takePhoto = async () => {
    // Request camera permissions (required for camera)
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Convert to JPEG for API compatibility
      const convertedUri = await convertImageToJpeg(result.assets[0].uri);
      setImage(convertedUri);
      setResultImages([]);
      setCurrentStep(2);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Convert to JPEG for API compatibility
      const convertedUri = await convertImageToJpeg(result.assets[0].uri);
      setImage(convertedUri);
      setResultImages([]);
      setCurrentStep(2);
    }
  };

  // Upload additional images (furniture, floors, etc.)
  const uploadAdditionalImage = async () => {
    if (!activeChip) {
      Alert.alert('Select an element', 'Choose what you want to change before adding a reference.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const originalUri = result.assets[0].uri;
      const originalName = result.assets[0].fileName || `product_${Date.now()}`;

      // Convert image to JPEG to ensure API compatibility (handles AVIF, HEIC, etc.)
      const convertedUri = await convertImageToJpeg(originalUri);

      // Ensure filename ends with .jpg
      const baseName = originalName.replace(/\.(avif|heic|heif|webp|png|gif)$/i, '');
      const jpegName =
        baseName.endsWith('.jpg') || baseName.endsWith('.jpeg') ? baseName : `${baseName}.jpg`;

      const newImage = {
        id: `upload_${Date.now()}_${Math.random()}`,
        uri: convertedUri,
        name: jpegName,
        category: activeChip,
      };
      setUploadedImages((prev) => [...prev, newImage]);
    }
  };

  // Remove uploaded image
  const removeUploadedImage = (imageId: string) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== imageId));
  };

  // Tutorial carousel slides
  const tutorialSlides = [
    {
      id: '1',
      title: 'Take a Photo',
      description:
        'Use your camera to capture the room you want to redesign. Make sure the lighting is good for best results.',
      icon: 'Camera' as const,
      iconColor: '#000',
      gradientColors: ['#fff', '#fff'] as [string, string],
      textColor: '#000',
      action: takePhoto,
    },
    {
      id: '2',
      title: 'Renovation Cost Simulation',
      description:
        'Get a detailed cost breakdown for your renovation project. Perfect for budget planning.',
      icon: 'Calculator' as const,
      iconColor: '#000',
      gradientColors: ['#fff', '#fff'] as [string, string],
      textColor: '#000',
      action: () => router.push('/screens/project-estimate'),
    },
    {
      id: '3',
      title: 'Choose from Gallery',
      description:
        'Select an existing photo from your gallery. Pick a clear image that shows the full room.',
      icon: 'Image' as const,
      iconColor: '#000',
      gradientColors: ['#fff', '#fff'] as [string, string],
      textColor: '#000',
      action: pickImage,
    },
    ...(Platform.OS === 'ios'
      ? [
          {
            id: '4',
            title: 'Scan with AR',
            description:
              'Use LiDAR to create an accurate 3D model of your room. Perfect for precise renovations.',
            icon: 'Scan' as const,
            iconColor: '#000',
            gradientColors: ['#fff', '#fff'] as [string, string],
            textColor: '#000',
            action: () => router.push('/screens/ar-room-scan'),
          },
        ]
      : []),
  ];

  type TutorialSlide = (typeof tutorialSlides)[number];

  const TutorialCarouselItem = ({
    item,
    index,
    animationValue,
  }: {
    item: TutorialSlide;
    index: number;
    animationValue: SharedValue<number>;
  }) => {
    const maskStyle = useAnimatedStyle(() => {
      const opacity = interpolate(animationValue.value, [-1, 0, 1], [1, 0, 1]);
      return { opacity };
    }, [animationValue]);

    return (
      <View
        style={{
          flex: 1,
          width: CARD_WIDTH,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 32,
        }}>
        <LiquidGlassCard
          style={{ width: CARD_WIDTH }}
          colors={colors}
          liquidGlassStyles={liquidGlassStyles}
          glassGradients={glassGradients}>
          <View style={liquidGlassStyles.cardContent}>
            <LiquidGlassIcon
              icon={item.icon}
              size={56}
              colors={colors}
              liquidGlassStyles={liquidGlassStyles}
              glassGradients={glassGradients}
            />

            <ThemedText style={liquidGlassStyles.title}>{item.title}</ThemedText>

            <ThemedText style={liquidGlassStyles.description}>{item.description}</ThemedText>

            <LiquidGlassButton
              onPress={item.action as any}
              title="Select"
              colors={colors}
              liquidGlassStyles={liquidGlassStyles}
              glassGradients={glassGradients}
            />

            {index < tutorialSlides.length - 1 && (
              <Pressable
                onPress={() => {
                  carouselRef.current?.scrollTo({ index: index + 1, animated: true });
                }}
                className="items-center py-3">
                <ThemedText style={liquidGlassStyles.skipText}>Swipe for more →</ThemedText>
              </Pressable>
            )}
          </View>
        </LiquidGlassCard>

        <AnimatedBlurView
          intensity={50}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, maskStyle]}
        />
      </View>
    );
  };

  const getErrorMessage = (error: any, statusCode?: number): string => {
    if (statusCode === 401) {
      return 'Invalid API key. Please check your OpenAI API key is correct.';
    }
    if (statusCode === 429) {
      return 'Rate limit exceeded. Please wait a moment and try again.';
    }
    if (statusCode === 400) {
      return `Bad request: ${error?.message || 'Check your image format and prompt.'}`;
    }
    if (statusCode === 413) {
      return 'Image too large. Please use a smaller image (max 4MB).';
    }
    if (statusCode === 500 || statusCode === 503) {
      return 'OpenAI service is temporarily unavailable. Please try again later.';
    }
    return error?.message || 'An unexpected error occurred.';
  };

  // Generate preview
  const handleGenerate = () => {
    setErrorDetails(null);
    setShowCompare(false);

    if (!apiKey) {
      Alert.alert('Configuration Error', 'API key is not configured. Please contact support.');
      return;
    }
    if (!image) {
      Alert.alert('Image Missing', 'Please select an image to edit.');
      return;
    }

    if (changeConfidence === 'locked' && selectedChips.length === 0) {
      setShowChipNudge(true);
      setTimeout(() => setShowChipNudge(false), 1500);
      return;
    }

    actuallyGenerate();
  };

  // Actually call the API
  const actuallyGenerate = async () => {
    setLoading(true);
    setResultImages([]);
    setActiveResultIndex(0);
    setCurrentStep(4);

    try {
      console.log('🚀 Starting image generation...');
      console.log('📦 Selected chips:', selectedChips);

      const formData = new FormData();

      // Build array of images: room image first, then furniture reference images
      // For gpt-image-1.5, first 5 images have higher fidelity
      // Use array notation 'image[]' to send multiple images
      const imagesArray: any[] = [];

      // Main room image (first for highest fidelity preservation)
      imagesArray.push({
        uri: image,
        name: 'room.png',
        type: 'image/png',
      });

      const orderReferenceEntries = (entries: ReferenceEntry[]) => {
        const rank = new Map<ChipKey, number>(CHIP_ORDER.map((category, idx) => [category, idx]));
        return entries
          .slice()
          .sort((a, b) => {
            const ra = rank.get(a.category) ?? 999;
            const rb = rank.get(b.category) ?? 999;
            if (ra !== rb) return ra - rb;
            return a.label.localeCompare(b.label);
          })
          .slice(0, 6);
      };

      const orderedReferences = orderReferenceEntries(referenceEntries);
      orderedReferences.forEach((entry) => {
        if (!entry.image) return;
        imagesArray.push(entry.image);
      });

      // Append images using array notation
      imagesArray.forEach((img) => {
        formData.append('image[]', img as any);
      });

      console.log(
        `📸 Sending ${imagesArray.length} images to API (room + ${orderedReferences.length} refs)`
      );

      formData.append('prompt', assembledPrompt);
      formData.append('input_fidelity', changeConfidence === 'locked' ? 'high' : 'low');
      formData.append('n', String(variationCount));
      formData.append('size', '1024x1024');
      formData.append('model', 'gpt-image-1'); // Using 1 for better multi-image support

      const response = await editImageWithOpenAI(formData);

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        const errorMsg = `Failed to parse response. Status: ${response.status}`;
        setErrorDetails(errorMsg);
        Alert.alert('Parse Error', 'Failed to parse API response.');
        setCurrentStep(3);
        return;
      }

      if (!response.ok || data.error) {
        const errorMessage = getErrorMessage(data.error, response.status);
        const detailedError = `Status: ${response.status}\nMessage: ${data.error?.message || 'No message'}`;
        setErrorDetails(detailedError);
        Alert.alert('OpenAI Error', errorMessage);
        setCurrentStep(3);
      } else if (data.data && data.data.length > 0) {
        const images = data.data
          .map((imageData: { url?: string; b64_json?: string }) => {
            if (imageData.url) return imageData.url;
            if (imageData.b64_json) return `data:image/png;base64,${imageData.b64_json}`;
            return '';
          })
          .filter(Boolean);
        setResultImages(images);
        setActiveResultIndex(0);
        setErrorDetails(null);
      } else {
        setErrorDetails(`Unexpected response: ${JSON.stringify(data).substring(0, 300)}`);
        Alert.alert('Error', 'No image returned from API.');
        setCurrentStep(3);
      }
    } catch (error: any) {
      const errorMsg = `Network Error: ${error.message || 'Unknown error'}`;
      setErrorDetails(errorMsg);
      Alert.alert('Network Error', 'Failed to connect to OpenAI API.');
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImage(null);
    setResultImages([]);
    setActiveResultIndex(0);
    setCurrentStep(1);
    setErrorDetails(null);
    setSelectedWall('');
    setSelectedFlooring('');
    setSelectedFlooringSampleId(null);
    setSelectedSofaStyle('');
    setSelectedTableStyle('');
    setSelectedLightingStyle('');
    setSelectedProductRefs({
      walls: [],
      floor: [],
      sofa: [],
      table: [],
      lighting: [],
    });
    setChangeConfidence('locked');
    setAccuracyMode('strict');
    setVariationCount(1);
    setSelectedChips([]);
    setActiveChip(null);
    setShowChipNudge(false);
    setIsSheetExpanded(false);
    setQuickPickTab('popular');
    setCreativePreset('');
    setLockMoreHint(false);
    setRoomType('');
    setUploadedImages([]);
    setShowCompare(false);
  };

  const cacheImageForExport = async (uri: string) => {
    const filename = `scan3D_${Date.now()}.png`;
    const cachePath = `${Paths.cache.uri}/${filename}`;

    if (uri.startsWith('http')) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const file = new File(cachePath);
          await file.write(base64, { encoding: 'base64' });
          resolve();
        };
      });
    } else if (uri.startsWith('data:')) {
      const base64Data = uri.split(',')[1];
      const file = new File(cachePath);
      await file.write(base64Data, { encoding: 'base64' });
    } else {
      const sourceFile = new File(uri);
      const destFile = new File(cachePath);
      await sourceFile.copy(destFile);
    }

    return cachePath;
  };

  const saveActiveResultToLibrary = async () => {
    if (!activeResultImage) return;
    try {
      const cachePath = await cacheImageForExport(activeResultImage);
      await MediaLibrary.saveToLibraryAsync(cachePath);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved!', 'Image saved to your photo library.');
    } catch (error) {
      console.error('Failed to save image:', error);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  const shareActiveResultImage = async () => {
    if (!activeResultImage) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device.');
        return;
      }

      const cachePath = await cacheImageForExport(activeResultImage);
      await Sharing.shareAsync(cachePath, {
        mimeType: 'image/png',
        dialogTitle: 'Share your scan3D design',
      });
    } catch (error) {
      console.error('Failed to share image:', error);
      Alert.alert('Error', 'Failed to share image.');
    }
  };

  const handleSaveDesign = async () => {
    const activeResult = resultImages[activeResultIndex];
    if (!image || !activeResult) {
      Alert.alert('Error', 'No images to save.');
      return;
    }
    try {
      await saveDesign(image, activeResult, assembledPrompt);
      Alert.alert('Saved!', 'Your design has been saved to My Designs.');
    } catch (error) {
      console.error('Failed to save design:', error);
      Alert.alert('Error', 'Failed to save design. Please try again.');
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const flowStep = currentStep === 4 ? 2 : 1;
  const flowLabel = currentStep === 4 ? 'Results' : 'Editor';

  // Progress bar (2-screen flow)
  const ProgressBar = () => (
    <View className="mb-6 flex-row gap-2">
      {[1, 2].map((step) => (
        <View
          key={step}
          className="h-1 flex-1 rounded-full"
          style={{
            backgroundColor: step <= flowStep ? colors.text : colors.border,
          }}
        />
      ))}
    </View>
  );

  const ChipPill = ({
    label,
    selected,
    onPress,
    emphasize,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
    emphasize?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      className="rounded-full border px-4 py-2"
      style={{
        backgroundColor: selected ? toRgba(colors.highlight, 0.15) : 'transparent',
        borderColor: emphasize ? colors.highlight : selected ? colors.highlight : colors.border,
      }}>
      <ThemedText
        className={selected ? 'font-semibold' : ''}
        style={{ color: selected ? colors.highlight : colors.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );

  const SegmentedControl = ({
    options,
    value,
    onChange,
  }: {
    options: { key: string; label: string; icon?: IconName }[];
    value: string;
    onChange: (key: string) => void;
  }) => (
    <View
      className="flex-row overflow-hidden rounded-full border"
      style={{ borderColor: colors.border }}>
      {options.map((option) => {
        const isSelected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            className="flex-1 flex-row items-center justify-center gap-2 px-4 py-2"
            style={{
              backgroundColor: isSelected ? toRgba(colors.highlight, 0.18) : 'transparent',
            }}>
            {option.icon && (
              <Icon
                name={option.icon}
                size={16}
                color={isSelected ? colors.highlight : colors.placeholder}
              />
            )}
            <ThemedText
              className={isSelected ? 'font-semibold' : ''}
              style={{ color: isSelected ? colors.highlight : colors.text }}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-global py-4"
        style={{ paddingTop: insets.top + 10, zIndex: 100 }}>
        {currentStep > 1 && !loading ? (
          <Pressable
            onPress={goBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={{ padding: 8 }}>
            <Icon name="ChevronLeft" size={24} color={colors.text} />
          </Pressable>
        ) : (
          <View className="w-10" />
        )}
        <ThemedText className="text-lg font-semibold" style={{ color: colors.text }}>
          {flowLabel} ({flowStep}/2)
        </ThemedText>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            resetAll();
          }}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={{ padding: 8 }}>
          <Icon name="X" size={24} color={colors.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: currentStep === 3 ? insets.bottom + 160 : insets.bottom + 100,
          }}
          className="flex-1 px-global"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <ProgressBar />

          {/* Step 1: Add Photo - Carousel Design */}
          {currentStep === 1 && (
            <View className="-mx-global h-full w-full flex-1" style={{ marginTop: 50 }}>
              {/* Carousel */}
              <Carousel
                ref={carouselRef}
                loop
                width={SCREEN_WIDTH}
                height={500}
                style={{
                  width: 545,
                  height: 500,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                containerStyle={{
                  width: SCREEN_WIDTH,
                  alignSelf: 'center',
                  overflow: 'visible',
                }}
                data={tutorialSlides}
                onProgressChange={(_offsetProgress, absoluteProgress) => {
                  const nextIndex = Math.round(absoluteProgress) % tutorialSlides.length;
                  setCarouselIndex(nextIndex);
                }}
                renderItem={({ item, index, animationValue }) => (
                  <TutorialCarouselItem item={item} index={index} animationValue={animationValue} />
                )}
                customAnimation={parallaxLayout(
                  { size: 100, vertical: false },
                  {
                    parallaxScrollingScale: 1,
                    parallaxAdjacentItemScale: 0.85,
                    parallaxScrollingOffset: 70,
                  }
                )}
                scrollAnimationDuration={1000}
              />

              {/* Pagination Dots */}
              <View className="flex-row justify-center gap-2 pb-8">
                {tutorialSlides.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: carouselIndex === index ? 24 : 8,
                      height: 4,
                      borderRadius: 4,
                      backgroundColor:
                        carouselIndex === index
                          ? glassGradients.paginationActive
                          : glassGradients.paginationInactive,
                    }}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Review Photo */}
          {currentStep === 2 && image && (
            <AnimatedView animation="fadeInUp">
              <ThemedText className="mb-2 text-2xl font-bold">Your Photo</ThemedText>
              <ThemedText className="text-light-subtext dark:text-dark-subtext mb-6">
                This is the room you want to redesign
              </ThemedText>

              <View className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border">
                <Image source={{ uri: image }} className="h-full w-full" resizeMode="cover" />
                <Pressable
                  onPress={() => {
                    setImage(null);
                    setCurrentStep(1);
                  }}
                  className="absolute right-4 top-4 rounded-full bg-black/50 p-2">
                  <Icon name="X" size={20} color="white" />
                </Pressable>
              </View>

              <LiquidGlassButton
                onPress={() => setCurrentStep(3)}
                title="Continue"
                colors={colors}
                liquidGlassStyles={liquidGlassStyles}
                glassGradients={glassGradients}
              />
            </AnimatedView>
          )}

          {/* Step 3: Editor */}
          {currentStep === 3 && (
            <AnimatedView animation="fadeInUp">
              <View className="mb-4">
                <View className="flex-row items-center justify-between">
                  <Pressable onPress={goBack} className="-ml-2 p-2">
                    <Icon name="ChevronLeft" size={20} color={colors.text} />
                  </Pressable>
                  <ThemedText className="text-base font-semibold" style={{ color: colors.text }}>
                    New Project
                  </ThemedText>
                  <Pressable
                    onPress={() =>
                      Alert.alert('Help', 'Select what you want to change, then generate.')
                    }
                    className="-mr-2 p-2">
                    <Icon name="CircleHelp" size={20} color={colors.text} />
                  </Pressable>
                </View>
              </View>

              {image && (
                <View className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
                  <BeforeAfterSlider
                    beforeImage={image}
                    afterImage={activeResultImage ?? image}
                    width={SCREEN_WIDTH - 48}
                    height={(SCREEN_WIDTH - 48) * 0.75}
                    borderRadius={16}
                  />
                </View>
              )}

              <View
                className="rounded-2xl border border-border p-4"
                style={{ backgroundColor: colors.secondary }}>
                <Pressable
                  onPress={() => setIsSheetExpanded(!isSheetExpanded)}
                  className="mb-4 items-center">
                  <View
                    style={{
                      width: 48,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: colors.border,
                    }}
                  />
                  <View className="mt-2 flex-row items-center gap-2">
                    <ThemedText className="text-xs" style={{ color: colors.placeholder }}>
                      {isSheetExpanded ? 'Collapse controls' : 'Expand for accuracy & variations'}
                    </ThemedText>
                    <Icon
                      name={isSheetExpanded ? 'ChevronUp' : 'ChevronDown'}
                      size={14}
                      color={colors.placeholder}
                    />
                  </View>
                </Pressable>

                <View className="mb-4">
                  <View className="mb-2 flex-row items-center justify-between">
                    <ThemedText className="font-semibold">What are we changing?</ThemedText>
                    {showChipNudge && (
                      <ThemedText className="text-xs" style={{ color: colors.highlight }}>
                        What do you want to change?
                      </ThemedText>
                    )}
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, paddingRight: 12 }}>
                    {CHIP_ORDER.map((chip) => (
                      <ChipPill
                        key={chip}
                        label={CHIP_LABELS[chip]}
                        selected={selectedChips.includes(chip)}
                        emphasize={showChipNudge && changeConfidence === 'locked'}
                        onPress={() => {
                          setShowChipNudge(false);
                          setSelectedChips((prev) => {
                            const isSelected = prev.includes(chip);
                            if (isSelected) {
                              return prev.filter((item) => item !== chip);
                            }
                            setActiveChip(chip);
                            return [...prev, chip];
                          });
                        }}
                      />
                    ))}
                  </ScrollView>
                </View>

                {activeChip && (
                  <View className="mb-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <ThemedText className="font-semibold">
                        {CHIP_LABELS[activeChip]} picks
                      </ThemedText>
                      <ThemedText className="text-xs" style={{ color: colors.placeholder }}>
                        {changeConfidence === 'locked' ? 'Exact match' : 'Inspiration'}
                      </ThemedText>
                    </View>
                    <View className="mb-3 flex-row gap-2">
                      {(['popular', 'recent', 'saved'] as QuickPickTab[]).map((tab) => {
                        const isSelected = quickPickTab === tab;
                        return (
                          <Pressable
                            key={tab}
                            onPress={() => setQuickPickTab(tab)}
                            className="rounded-full border px-3 py-1"
                            style={{
                              borderColor: isSelected ? colors.highlight : colors.border,
                              backgroundColor: isSelected
                                ? toRgba(colors.highlight, 0.12)
                                : 'transparent',
                            }}>
                            <ThemedText
                              className={isSelected ? 'font-semibold' : ''}
                              style={{ color: isSelected ? colors.highlight : colors.text }}>
                              {tab === 'popular'
                                ? 'Popular'
                                : tab === 'recent'
                                  ? 'Recent'
                                  : 'Saved'}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 24, gap: 12 }}>
                      <Pressable
                        onPress={() => {
                          if (activeChip === 'floor') setShowFlooringPicker(true);
                          if (activeChip === 'walls') setShowWallPicker(true);
                          if (activeChip === 'sofa') setShowSofaPicker(true);
                          if (activeChip === 'table') setShowTablePicker(true);
                          if (activeChip === 'lighting') setShowLightingPicker(true);
                        }}
                        className="items-center justify-center rounded-2xl border border-dashed"
                        style={{
                          width: 120,
                          height: 120,
                          borderColor: colors.border,
                        }}>
                        <Icon name="Search" size={20} color={colors.placeholder} />
                        <ThemedText className="mt-2 text-xs" style={{ color: colors.placeholder }}>
                          Browse all
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={uploadAdditionalImage}
                        className="items-center justify-center rounded-2xl border border-dashed"
                        style={{
                          width: 120,
                          height: 120,
                          borderColor: colors.border,
                        }}>
                        <Icon name="Upload" size={20} color={colors.placeholder} />
                        <ThemedText className="mt-2 text-xs" style={{ color: colors.placeholder }}>
                          Upload
                        </ThemedText>
                      </Pressable>

                      {activeChip === 'floor' &&
                        flooringReferenceItems.map((item) => {
                          const isSelected = selectedFlooringSampleId === item.id;
                          return (
                            <Pressable
                              key={item.id}
                              onPress={() => {
                                setSelectedFlooring(item.name);
                                setSelectedFlooringSampleId(item.id);
                              }}
                              className="items-center"
                              style={{ width: 120 }}>
                              <View
                                className={`mb-2 overflow-hidden rounded-2xl border-2 ${
                                  isSelected ? 'border-highlight' : 'border-border'
                                }`}
                                style={{
                                  width: 120,
                                  height: 120,
                                  backgroundColor: colors.secondary,
                                }}>
                                <Image
                                  source={item.image}
                                  style={{ width: '100%', height: '100%' }}
                                  resizeMode="cover"
                                />
                                {isSelected && (
                                  <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-highlight">
                                    <Icon name="Check" size={14} color="#FFFFFF" />
                                  </View>
                                )}
                              </View>
                              <ThemedText className="text-center text-xs" numberOfLines={2}>
                                {item.name}
                              </ThemedText>
                            </Pressable>
                          );
                        })}

                      {activeChip === 'walls' &&
                        WALL_OPTIONS.map((option) => {
                          const isSelected = selectedWall === option;
                          return (
                            <Pressable
                              key={option}
                              onPress={() => setSelectedWall(option)}
                              className="items-center"
                              style={{ width: 120 }}>
                              <View
                                className={`mb-2 overflow-hidden rounded-2xl border-2 ${
                                  isSelected ? 'border-highlight' : 'border-border'
                                }`}
                                style={{
                                  width: 120,
                                  height: 120,
                                  backgroundColor: WALL_COLOR_MAP[option] || colors.secondary,
                                }}>
                                {isSelected && (
                                  <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-highlight">
                                    <Icon name="Check" size={14} color="#FFFFFF" />
                                  </View>
                                )}
                              </View>
                              <ThemedText className="text-center text-xs" numberOfLines={2}>
                                {option}
                              </ThemedText>
                            </Pressable>
                          );
                        })}

                      {(activeChip === 'sofa' || activeChip === 'table') &&
                        furnitureReferenceItems.map((item) => {
                          const isSelected = selectedProductRefs[activeChip]?.includes(item.id);
                          return (
                            <Pressable
                              key={`${activeChip}_${item.id}`}
                              onPress={() => {
                                const currentlySelected = selectedProductRefs[activeChip]?.includes(
                                  item.id
                                );
                                setSelectedProductRefs((prev) => {
                                  const existing = prev[activeChip] || [];
                                  const next = currentlySelected
                                    ? existing.filter((id) => id !== item.id)
                                    : [...existing, item.id];
                                  return { ...prev, [activeChip]: next };
                                });
                                if (!currentlySelected) {
                                  if (activeChip === 'sofa') setSelectedSofaStyle(item.name);
                                  if (activeChip === 'table') setSelectedTableStyle(item.name);
                                }
                              }}
                              className="items-center"
                              style={{ width: 120 }}>
                              <View
                                className={`mb-2 overflow-hidden rounded-2xl border-2 ${
                                  isSelected ? 'border-highlight' : 'border-border'
                                }`}
                                style={{
                                  width: 120,
                                  height: 120,
                                  backgroundColor: colors.secondary,
                                }}>
                                <Image
                                  source={item.image}
                                  style={{ width: '100%', height: '100%' }}
                                  resizeMode="contain"
                                />
                                {isSelected && (
                                  <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-highlight">
                                    <Icon name="Check" size={14} color="#FFFFFF" />
                                  </View>
                                )}
                              </View>
                              <ThemedText className="text-center text-xs" numberOfLines={2}>
                                {item.name}
                              </ThemedText>
                            </Pressable>
                          );
                        })}

                      {activeChip === 'lighting' &&
                        LIGHTING_OPTIONS.map((option) => {
                          const isSelected = selectedLightingStyle === option;
                          return (
                            <Pressable
                              key={option}
                              onPress={() => setSelectedLightingStyle(option)}
                              className="items-center"
                              style={{ width: 120 }}>
                              <View
                                className={`mb-2 items-center justify-center overflow-hidden rounded-2xl border-2 px-3 ${
                                  isSelected ? 'border-highlight' : 'border-border'
                                }`}
                                style={{
                                  width: 120,
                                  height: 120,
                                  backgroundColor: colors.secondary,
                                }}>
                                <ThemedText className="text-center text-xs" numberOfLines={3}>
                                  {option}
                                </ThemedText>
                              </View>
                            </Pressable>
                          );
                        })}

                      {uploadedImages
                        .filter((img) => img.category === activeChip)
                        .map((uploadedImg) => (
                          <View
                            key={uploadedImg.id}
                            className="items-center"
                            style={{ width: 120 }}>
                            <View className="relative">
                              <View
                                className="overflow-hidden rounded-2xl border-2 border-highlight"
                                style={{
                                  width: 120,
                                  height: 120,
                                  backgroundColor: colors.secondary,
                                }}>
                                <Image
                                  source={{ uri: uploadedImg.uri }}
                                  style={{ width: '100%', height: '100%' }}
                                  resizeMode="cover"
                                />
                              </View>
                              <Pressable
                                onPress={() => removeUploadedImage(uploadedImg.id)}
                                className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500">
                                <Icon name="X" size={12} color="#FFFFFF" />
                              </Pressable>
                            </View>
                            <ThemedText className="mt-2 text-center text-xs" numberOfLines={2}>
                              {uploadedImg.name}
                            </ThemedText>
                          </View>
                        ))}
                    </ScrollView>
                  </View>
                )}

                <View className="mb-4">
                  <ThemedText className="mb-2 font-semibold">Change confidence</ThemedText>
                  <SegmentedControl
                    options={[
                      { key: 'locked', label: 'Keep everything else the same', icon: 'Lock' },
                      { key: 'creative', label: 'Explore freely', icon: 'Sparkles' },
                    ]}
                    value={changeConfidence}
                    onChange={(key) => setChangeConfidence(key as ChangeConfidence)}
                  />
                  {lockMoreHint && (
                    <ThemedText className="mt-2 text-xs" style={{ color: colors.highlight }}>
                      Lock more enabled for tighter preservation.
                    </ThemedText>
                  )}
                </View>

                {isSheetExpanded && (
                  <View className="gap-4">
                    {changeConfidence === 'locked' && (
                      <View>
                        <ThemedText className="mb-2 font-semibold">Accuracy</ThemedText>
                        <SegmentedControl
                          options={[
                            { key: 'strict', label: 'Strict' },
                            { key: 'balanced', label: 'Balanced' },
                          ]}
                          value={accuracyMode}
                          onChange={(key) => setAccuracyMode(key as AccuracyMode)}
                        />
                      </View>
                    )}

                    <View>
                      <ThemedText className="mb-2 font-semibold">Variations</ThemedText>
                      <SegmentedControl
                        options={[
                          { key: '1', label: '1' },
                          { key: '4', label: '4' },
                        ]}
                        value={String(variationCount)}
                        onChange={(key) => setVariationCount(Number(key))}
                      />
                    </View>

                    {changeConfidence === 'creative' && (
                      <View>
                        <ThemedText className="mb-2 font-semibold">Creative presets</ThemedText>
                        <View className="flex-row flex-wrap gap-2">
                          {['Modern', 'Cozy', 'Minimal', 'Bold'].map((preset) => (
                            <Pressable
                              key={preset}
                              onPress={() =>
                                setCreativePreset(creativePreset === preset ? '' : preset)
                              }
                              className="rounded-full border px-4 py-2"
                              style={{
                                borderColor:
                                  creativePreset === preset ? colors.highlight : colors.border,
                                backgroundColor:
                                  creativePreset === preset
                                    ? toRgba(colors.highlight, 0.15)
                                    : 'transparent',
                              }}>
                              <ThemedText
                                className={creativePreset === preset ? 'font-semibold' : ''}
                                style={{
                                  color: creativePreset === preset ? colors.highlight : colors.text,
                                }}>
                                {preset}
                              </ThemedText>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </AnimatedView>
          )}

          {/* Step 4: Processing / Result */}
          {currentStep === 4 && (
            <AnimatedView animation="fadeInUp">
              {loading ? (
                <View className="items-center py-16">
                  <View className="mb-8 h-36 w-36 overflow-hidden rounded-3xl border border-border">
                    {image && (
                      <Image source={{ uri: image }} className="h-full w-full" resizeMode="cover" />
                    )}
                  </View>

                  {/* Progress Bar */}
                  <View className="mb-4 w-full">
                    <View className="h-2 overflow-hidden rounded-full bg-border">
                      <Animated.View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: colors.highlight,
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        }}
                      />
                    </View>
                    <View className="mt-2 flex-row justify-between">
                      <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
                        {progress}%
                      </ThemedText>
                      <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
                        ~{Math.max(0, Math.ceil((100 - progress) * 0.6))}s remaining
                      </ThemedText>
                    </View>
                  </View>

                  <ActivityIndicator size="small" color={colors.highlight} className="mb-3" />
                  <ThemedText className="mb-2 text-2xl font-semibold">Processing...</ThemedText>
                  <ThemedText className="text-light-subtext dark:text-dark-subtext px-4 text-center">
                    AI is transforming your room. Please don't close the app.
                  </ThemedText>
                </View>
              ) : activeResultImage ? (
                <>
                  <View className="mb-2 flex-row items-center justify-between">
                    <ThemedText className="text-2xl font-bold">Design Preview</ThemedText>
                    <View
                      className="rounded-full border px-3 py-1"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: toRgba(colors.highlight, 0.08),
                      }}>
                      <ThemedText className="text-xs font-semibold" style={{ color: colors.text }}>
                        {changeConfidence === 'locked' ? 'Locked edit' : 'Creative concept'}
                      </ThemedText>
                    </View>
                  </View>

                  <View className="mb-4 flex-row items-center justify-between">
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <SegmentedControl
                        options={[
                          { key: 'after', label: 'After' },
                          { key: 'compare', label: 'Before/After' },
                        ]}
                        value={showCompare ? 'compare' : 'after'}
                        onChange={(key) => setShowCompare(key === 'compare')}
                      />
                    </View>
                    {resultImages.length > 1 && (
                      <ThemedText className="text-xs" style={{ color: colors.placeholder }}>
                        {activeResultIndex + 1}/{resultImages.length}
                      </ThemedText>
                    )}
                  </View>

                  {/* Result Image or Compare Slider */}
                  <View className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-secondary">
                    {showCompare ? (
                      <BeforeAfterSlider
                        beforeImage={image!}
                        afterImage={activeResultImage}
                        width={SCREEN_WIDTH - 48}
                        height={(SCREEN_WIDTH - 48) * 0.75}
                        borderRadius={16}
                      />
                    ) : (
                      <>
                        {resultImages.length > 1 ? (
                          <FlatList
                            data={resultImages}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${item}_${index}`}
                            onMomentumScrollEnd={(event) => {
                              const nextIndex = Math.round(
                                event.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 48)
                              );
                              setActiveResultIndex(nextIndex);
                            }}
                            snapToInterval={SCREEN_WIDTH - 48}
                            decelerationRate="fast"
                            renderItem={({ item }) => (
                              <Image
                                source={{ uri: item }}
                                style={{
                                  width: SCREEN_WIDTH - 48,
                                  height: (SCREEN_WIDTH - 48) * 0.75,
                                }}
                                resizeMode="cover"
                              />
                            )}
                          />
                        ) : (
                          <Image
                            source={{ uri: activeResultImage }}
                            className="h-full w-full"
                            resizeMode="cover"
                          />
                        )}
                        <Pressable
                          onPress={() => setShowFullscreen(true)}
                          className="absolute bottom-3 right-3 rounded-lg bg-black/60 p-2">
                          <Icon name="Maximize2" size={18} color="white" />
                        </Pressable>
                      </>
                    )}
                  </View>

                  {!showCompare && resultImages.length > 1 && (
                    <View className="mb-4 flex-row items-center justify-center gap-2">
                      {resultImages.map((_, index) => (
                        <View
                          key={`dot_${index}`}
                          style={{
                            width: index === activeResultIndex ? 18 : 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor:
                              index === activeResultIndex ? colors.highlight : colors.border,
                          }}
                        />
                      ))}
                    </View>
                  )}

                  <View className="mb-3 flex-row gap-3">
                    <Button
                      title="Refine"
                      variant="ghost"
                      className="flex-1"
                      onPress={() => {
                        setShowCompare(false);
                        setCurrentStep(3);
                      }}
                    />
                    <Button
                      title="Save"
                      variant="primary"
                      className="flex-1"
                      onPress={handleSaveDesign}
                    />
                  </View>

                  <Button title="Export / Share" variant="ghost" onPress={shareActiveResultImage} />

                  {changeConfidence === 'locked' && (
                    <View className="mt-3">
                      <Button
                        title="Fix unwanted changes"
                        variant="ghost"
                        onPress={() => {
                          setChangeConfidence('locked');
                          setAccuracyMode('strict');
                          setLockMoreHint(true);
                          setShowCompare(false);
                          setCurrentStep(3);
                        }}
                      />
                    </View>
                  )}
                </>
              ) : (
                <View className="items-center py-20">
                  <Icon name="AlertCircle" size={48} color={colors.placeholder} />
                  <ThemedText className="mb-2 mt-4 text-xl font-semibold">
                    Something went wrong
                  </ThemedText>
                  <ThemedText className="text-light-subtext dark:text-dark-subtext mb-6 text-center">
                    {errorDetails || 'Please try again'}
                  </ThemedText>
                  <Button title="Try Again" variant="primary" onPress={() => setCurrentStep(3)} />
                </View>
              )}
            </AnimatedView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {currentStep === 3 && !loading && (
        <View
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: insets.bottom + 16,
          }}>
          <Button title="Generate" variant="primary" onPress={handleGenerate} />
          <ThemedText className="mt-2 text-center text-xs" style={{ color: colors.placeholder }}>
            Photorealistic - Preserves your room
          </ThemedText>
        </View>
      )}

      {/* Fullscreen Image Modal */}
      <Modal
        visible={showFullscreen}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullscreen(false)}>
        <View className="flex-1 bg-black">
          {/* Top bar with close button */}
          <View
            className="absolute left-0 right-0 top-0 z-10 flex-row items-center justify-between px-4"
            style={{ paddingTop: insets.top + 10 }}>
            <Pressable
              onPress={() => setShowFullscreen(false)}
              className="rounded-full bg-white/20 p-3">
              <Icon name="X" size={24} color="white" />
            </Pressable>

            <ThemedText className="text-sm text-white opacity-60">Pinch to zoom</ThemedText>

            <View style={{ width: 48 }} />
          </View>

          {/* Zoomable image */}
          {activeResultImage && (
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              maximumZoomScale={5}
              minimumZoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              centerContent
              bouncesZoom>
              <Image
                source={{ uri: activeResultImage }}
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_WIDTH,
                }}
                resizeMode="contain"
              />
            </ScrollView>
          )}

          {/* Bottom action bar */}
          <View
            className="absolute bottom-0 left-0 right-0 flex-row justify-center gap-6 px-6"
            style={{ paddingBottom: insets.bottom + 20 }}>
            {/* Save to Photos */}
            <Pressable onPress={saveActiveResultToLibrary} className="items-center">
              {supportsNativeLiquidGlass ? (
                <GlassView
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  glassEffectStyle="regular"
                  tintColor="rgba(255,255,255,0.2)">
                  <Icon name="Download" size={24} color="white" />
                </GlassView>
              ) : (
                <View className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <Icon name="Download" size={24} color="white" />
                </View>
              )}
              <ThemedText className="mt-2 text-xs text-white opacity-80">Save</ThemedText>
            </Pressable>

            {/* Share */}
            <Pressable onPress={shareActiveResultImage} className="items-center">
              {supportsNativeLiquidGlass ? (
                <GlassView
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  glassEffectStyle="regular"
                  tintColor="rgba(255,255,255,0.2)">
                  <Icon name="Share" size={24} color="white" />
                </GlassView>
              ) : (
                <View className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <Icon name="Share" size={24} color="white" />
                </View>
              )}
              <ThemedText className="mt-2 text-xs text-white opacity-80">Share</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Wall Picker - Animated Bottom Sheet */}
      <AnimatedBottomSheet
        visible={showWallPicker}
        onClose={() => setShowWallPicker(false)}
        title="Select Wall Treatment"
        height={0.65}>
        <Pressable
          onPress={() => {
            setSelectedWall('');
            setShowWallPicker(false);
          }}
          className="mb-4 items-center rounded-xl border border-dashed border-border p-3">
          <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
            Auto-selected (recommended)
          </ThemedText>
        </Pressable>

        {WALL_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              setSelectedWall(option);
              setShowWallPicker(false);
            }}
            className={`mb-3 flex-row items-center justify-between rounded-xl p-4 ${
              selectedWall === option ? 'bg-highlight/20' : 'bg-secondary'
            }`}
            style={
              selectedWall === option
                ? { borderWidth: 2, borderColor: colors.highlight }
                : { borderWidth: 1, borderColor: colors.border }
            }>
            <View className="flex-row items-center gap-3">
              <Icon
                name="Square"
                size={20}
                color={selectedWall === option ? colors.highlight : colors.placeholder}
              />
              <ThemedText className={selectedWall === option ? 'font-semibold' : ''}>
                {option}
              </ThemedText>
            </View>
            {selectedWall === option && <Icon name="Check" size={20} color={colors.highlight} />}
          </Pressable>
        ))}
      </AnimatedBottomSheet>

      {/* Flooring Picker - Animated Bottom Sheet with Image Thumbnails */}
      <AnimatedBottomSheet
        visible={showFlooringPicker}
        onClose={() => setShowFlooringPicker(false)}
        title="Select Flooring"
        height={0.75}>
        <Pressable
          onPress={() => {
            setSelectedFlooring('');
            setSelectedFlooringSampleId(null);
            setShowFlooringPicker(false);
          }}
          className="mb-4 items-center rounded-xl border border-dashed border-border p-3">
          <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
            Auto-selected (recommended)
          </ThemedText>
        </Pressable>

        <ThemedText className="mb-3 text-sm font-semibold">Flooring references</ThemedText>
        <View className="flex-row flex-wrap justify-between">
          {flooringReferenceItems.map((item) => {
            const isSelected = selectedFlooringSampleId === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setSelectedFlooring(item.name);
                  setSelectedFlooringSampleId(item.id);
                  setShowFlooringPicker(false);
                }}
                style={{ width: '48%', marginBottom: 12 }}>
                <View
                  className={`overflow-hidden rounded-2xl ${
                    isSelected ? 'border-2 border-highlight' : 'border border-border'
                  }`}
                  style={{ backgroundColor: colors.secondary }}>
                  <Image
                    source={item.image}
                    style={{ width: '100%', height: 100 }}
                    resizeMode="cover"
                  />
                  {isSelected && (
                    <View className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-highlight">
                      <Icon name="Check" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <ThemedText className="mt-2 text-center text-sm font-medium">
                  {item.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </AnimatedBottomSheet>

      {/* Sofa Picker - Animated Bottom Sheet */}
      <AnimatedBottomSheet
        visible={showSofaPicker}
        onClose={() => setShowSofaPicker(false)}
        title="Select Sofa Style"
        height={0.6}>
        <Pressable
          onPress={() => {
            setSelectedSofaStyle('');
            setShowSofaPicker(false);
          }}
          className="mb-4 items-center rounded-xl border border-dashed border-border p-3">
          <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
            Auto-selected (recommended)
          </ThemedText>
        </Pressable>

        {SOFA_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              setSelectedSofaStyle(option);
              setShowSofaPicker(false);
            }}
            className={`mb-3 flex-row items-center justify-between rounded-xl p-4 ${
              selectedSofaStyle === option ? 'bg-highlight/20' : 'bg-secondary'
            }`}
            style={
              selectedSofaStyle === option
                ? { borderWidth: 2, borderColor: colors.highlight }
                : { borderWidth: 1, borderColor: colors.border }
            }>
            <View className="flex-row items-center gap-3">
              <Icon
                name="Armchair"
                size={20}
                color={selectedSofaStyle === option ? colors.highlight : colors.placeholder}
              />
              <ThemedText className={selectedSofaStyle === option ? 'font-semibold' : ''}>
                {option}
              </ThemedText>
            </View>
            {selectedSofaStyle === option && (
              <Icon name="Check" size={20} color={colors.highlight} />
            )}
          </Pressable>
        ))}
      </AnimatedBottomSheet>

      {/* Table Picker - Animated Bottom Sheet */}
      <AnimatedBottomSheet
        visible={showTablePicker}
        onClose={() => setShowTablePicker(false)}
        title="Select Table Style"
        height={0.6}>
        <Pressable
          onPress={() => {
            setSelectedTableStyle('');
            setShowTablePicker(false);
          }}
          className="mb-4 items-center rounded-xl border border-dashed border-border p-3">
          <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
            Auto-selected (recommended)
          </ThemedText>
        </Pressable>

        {TABLE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              setSelectedTableStyle(option);
              setShowTablePicker(false);
            }}
            className={`mb-3 flex-row items-center justify-between rounded-xl p-4 ${
              selectedTableStyle === option ? 'bg-highlight/20' : 'bg-secondary'
            }`}
            style={
              selectedTableStyle === option
                ? { borderWidth: 2, borderColor: colors.highlight }
                : { borderWidth: 1, borderColor: colors.border }
            }>
            <View className="flex-row items-center gap-3">
              <Icon
                name="Table"
                size={20}
                color={selectedTableStyle === option ? colors.highlight : colors.placeholder}
              />
              <ThemedText className={selectedTableStyle === option ? 'font-semibold' : ''}>
                {option}
              </ThemedText>
            </View>
            {selectedTableStyle === option && (
              <Icon name="Check" size={20} color={colors.highlight} />
            )}
          </Pressable>
        ))}
      </AnimatedBottomSheet>

      {/* Lighting Picker - Animated Bottom Sheet */}
      <AnimatedBottomSheet
        visible={showLightingPicker}
        onClose={() => setShowLightingPicker(false)}
        title="Select Lighting Style"
        height={0.6}>
        <Pressable
          onPress={() => {
            setSelectedLightingStyle('');
            setShowLightingPicker(false);
          }}
          className="mb-4 items-center rounded-xl border border-dashed border-border p-3">
          <ThemedText className="text-light-subtext dark:text-dark-subtext text-sm">
            Auto-selected (recommended)
          </ThemedText>
        </Pressable>

        {LIGHTING_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              setSelectedLightingStyle(option);
              setShowLightingPicker(false);
            }}
            className={`mb-3 flex-row items-center justify-between rounded-xl p-4 ${
              selectedLightingStyle === option ? 'bg-highlight/20' : 'bg-secondary'
            }`}
            style={
              selectedLightingStyle === option
                ? { borderWidth: 2, borderColor: colors.highlight }
                : { borderWidth: 1, borderColor: colors.border }
            }>
            <View className="flex-row items-center gap-3">
              <Icon
                name="Lamp"
                size={20}
                color={selectedLightingStyle === option ? colors.highlight : colors.placeholder}
              />
              <ThemedText className={selectedLightingStyle === option ? 'font-semibold' : ''}>
                {option}
              </ThemedText>
            </View>
            {selectedLightingStyle === option && (
              <Icon name="Check" size={20} color={colors.highlight} />
            )}
          </Pressable>
        ))}
      </AnimatedBottomSheet>

      {/* Room Type Picker - Animated Bottom Sheet */}
      <AnimatedBottomSheet
        visible={showRoomTypePicker}
        onClose={() => setShowRoomTypePicker(false)}
        title="Select Room Type"
        height={0.6}>
        {ROOM_TYPE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              setRoomType(option);
              setShowRoomTypePicker(false);
            }}
            className={`mb-3 flex-row items-center justify-between rounded-xl p-4 ${
              roomType === option ? 'bg-highlight/20' : 'bg-secondary'
            }`}
            style={
              roomType === option
                ? { borderWidth: 2, borderColor: colors.highlight }
                : { borderWidth: 1, borderColor: colors.border }
            }>
            <View className="flex-row items-center gap-3">
              <Icon
                name="Home"
                size={20}
                color={roomType === option ? colors.highlight : colors.placeholder}
              />
              <ThemedText className={roomType === option ? 'font-semibold' : ''}>
                {option}
              </ThemedText>
            </View>
            {roomType === option && <Icon name="Check" size={20} color={colors.highlight} />}
          </Pressable>
        ))}
      </AnimatedBottomSheet>
    </View>
  );
}
