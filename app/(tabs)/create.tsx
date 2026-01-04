import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Image, TextInput, ScrollView, Alert, ActivityIndicator, Pressable, KeyboardAvoidingView, Platform, Modal, Animated, PanResponder, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { Button } from '@/components/Button';
import ThemedText from '@/components/ThemedText';
import useThemeColors from '@/app/contexts/ThemeColors';
import Icon from '@/components/Icon';
import AnimatedView from '@/components/AnimatedView';
import { saveDesign } from '@/app/utils/designStorage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH - 80;     

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

const createLiquidGlassStyles = (colors: ReturnType<typeof useThemeColors>) =>
    StyleSheet.create({
        cardOuter: {
            borderRadius: 32,
            overflow: 'hidden',
            shadowColor: colors.isDark ? 'rgba(0,0,0,0.6)' : toRgba(colors.text, 0.2),
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.6,
            shadowRadius: 24,
        },
        cardBlur: {
            borderRadius: 32,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        topHighlight: {
            position: 'absolute',
            top: 0,
            left: 20,
            right: 20,
            height: 1,
            backgroundColor: toRgba(colors.text, colors.isDark ? 0.18 : 0.28),
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
            shadowColor: colors.isDark ? 'rgba(0,0,0,0.6)' : toRgba(colors.text, 0.2),
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
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 12,
            letterSpacing: -0.5,
        },
        description: {
            fontSize: 15,
            lineHeight: 22,
            color: colors.text,
            textAlign: 'center',
            marginBottom: 28,
            paddingHorizontal: 8,
            opacity: colors.isDark ? 0.7 : 0.65,
        },
        actionButton: {
            borderRadius: 50,
            overflow: 'hidden',
            width: '100%',
            shadowColor: colors.isDark ? 'rgba(0,0,0,0.4)' : toRgba(colors.accent, 0.25),
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
        },
        buttonBlur: {
            borderRadius: 50,
            borderWidth: 1,
            borderColor: colors.border,
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
            color: colors.text,
            letterSpacing: 0.5,
        },
        skipText: {
            fontSize: 13,
            color: colors.text,
            fontWeight: '500',
            opacity: colors.isDark ? 0.6 : 0.7,
        },
    });

// Step Badge Component - Based on Figma design (node 3528:41)
// Dark gray circle with white number inside
const StepBadge = ({ number }: { number: number }) => (
    <View 
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: '#9B744D' }}
    >
        <ThemedText className="text-sm font-bold" style={{ color: '#FFFFFF' }}>{number}</ThemedText>
    </View>
);

export default function CreateScreen() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const liquidGlassStyles = useMemo(() => createLiquidGlassStyles(colors), [colors]);
    const glassGradients = useMemo(() => {
        const accentSoft = toRgba(colors.accent, colors.isDark ? 0.25 : 0.2);
        const secondarySoft = toRgba(colors.secondary, colors.isDark ? 0.75 : 0.55);
        const backgroundSoft = toRgba(colors.bg, colors.isDark ? 0.92 : 0.85);
        const textSoft = toRgba(colors.text, colors.isDark ? 0.12 : 0.18);

        return {
            card: (colors.isDark
                ? [backgroundSoft, secondarySoft]
                : [secondarySoft, accentSoft]) as [string, string],
            icon: (colors.isDark
                ? [textSoft, toRgba(colors.text, 0.04)]
                : [accentSoft, toRgba(colors.secondary, 0.25)]) as [string, string],
            button: (colors.isDark
                ? [toRgba(colors.secondary, 0.9), toRgba(colors.bg, 0.9)]
                : [toRgba(colors.accent, 0.35), toRgba(colors.secondary, 0.35)]) as [string, string],
            paginationActive: colors.accent,
            paginationInactive: colors.isDark
                ? toRgba(colors.text, 0.25)
                : toRgba(colors.accent, 0.35),
        };
    }, [colors]);

    const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const [selectedFurniture, setSelectedFurniture] = useState<number[]>([]);
    
    // Design customization options
    const [selectedWall, setSelectedWall] = useState('');
    const [selectedFlooring, setSelectedFlooring] = useState('');
    const [selectedFlooringSampleId, setSelectedFlooringSampleId] = useState<string | null>(null);
    const [selectedFurnitureStyle, setSelectedFurnitureStyle] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [showWallPicker, setShowWallPicker] = useState(false);
    const [showFlooringPicker, setShowFlooringPicker] = useState(false);
    const [showFurnitureStylePicker, setShowFurnitureStylePicker] = useState(false);
    const [showStylePicker, setShowStylePicker] = useState(false);
    const [showRecap, setShowRecap] = useState(false);
    const [sliderCompleted, setSliderCompleted] = useState(false);
    const [shouldGenerate, setShouldGenerate] = useState(false);
    const sliderPosition = useRef(new Animated.Value(0)).current;
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselRef = useRef<FlatList>(null);
    
    // Furniture reference images state
    const [selectedFurnitureItems, setSelectedFurnitureItems] = useState<string[]>([]);
    const [placementInstructions, setPlacementInstructions] = useState('');
    
    // User uploaded images state
    // User uploaded images state (furniture, floors, etc.)
    const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; uri: string; name: string }>>([]);
    
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
        { id: 'mueble1', name: 'Sideboard', image: require('@/assets/img/Mueble1 Background Removed.png') },
        { id: 'mueble2', name: 'Cabinet', image: require('@/assets/img/Mueble2 Background Removed.png') },
        { id: 'mueble4', name: 'Bookshelf', image: require('@/assets/img/Mueble4 Background Removed.png') },
        { id: 'mueble5', name: 'Console Table', image: require('@/assets/img/Mueble5 Background Removed.png') },
    ];
    
    // Slider configuration
    const SLIDER_WIDTH = SCREEN_WIDTH - 80; // Container width minus padding
    const SLIDER_BUTTON_SIZE = 64;
    const SLIDER_MAX = SLIDER_WIDTH - SLIDER_BUTTON_SIZE - 8; // Max slide distance

    // Pan responder for the swipe slider
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newValue = Math.max(0, Math.min(gestureState.dx, SLIDER_MAX));
                sliderPosition.setValue(newValue);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx >= SLIDER_MAX * 0.9) {
                    // Slider completed - snap to end and trigger
                    Animated.spring(sliderPosition, {
                        toValue: SLIDER_MAX,
                        useNativeDriver: false,
                    }).start(() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        setSliderCompleted(true);
                        // Trigger generation via state
                        setTimeout(() => {
                            setShowRecap(false);
                            setShouldGenerate(true);
                        }, 300);
                    });
                } else {
                    // Reset slider
                    Animated.spring(sliderPosition, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

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

    const FURNITURE_STYLE_OPTIONS = [
        'Modern Minimalist',
        'Mid-Century Modern',
        'Contemporary',
        'Traditional Classic',
        'Rustic Farmhouse',
        'Industrial',
        'Bohemian',
        'Art Deco',
        'Japandi',
        'Coastal',
    ];

    const STYLE_OPTIONS = [
        'Bright & Airy',
        'Warm & Cozy',
        'Elegant & Luxurious',
        'Clean & Minimal',
        'Bold & Dramatic',
        'Natural & Organic',
        'Sleek & Modern',
        'Vintage & Eclectic',
        'Serene & Calm',
        'Chic & Sophisticated',
    ];

    // Build prompt from selections
    const buildPromptFromSelections = () => {
        const parts: string[] = [];
        
        if (selectedStyle) parts.push(`${selectedStyle} interior design`);
        if (selectedWall) parts.push(`${selectedWall.toLowerCase()} walls`);
        if (selectedFlooring) parts.push(`${selectedFlooring.toLowerCase()} flooring`);
        if (selectedFurnitureStyle) parts.push(`${selectedFurnitureStyle.toLowerCase()} furniture`);
        if (selectedFlooringSampleId) {
            parts.push('Match the floor finish to the selected flooring reference image.');
        }
        
        // Add furniture placement instructions if furniture is selected
        const allFurnitureItems = [...selectedFurnitureItems, ...uploadedImages.map(img => img.name)];
        
        if (allFurnitureItems.length > 0) {
            const furnitureNames = selectedFurnitureItems.map(id => {
                const item = furnitureReferenceItems.find(i => i.id === id);
                return item ? item.name : '';
            }).filter(Boolean);
            
            const uploadedNames = uploadedImages.map(img => img.name);
            const allNames = [...furnitureNames, ...uploadedNames];
            
            // Detailed description for AI to understand what products to add
            parts.push(`Add and place the following products into the room design: ${allNames.join(', ')}. Each product should be seamlessly integrated into the existing room space, maintaining proper scale, lighting, shadows, and perspective that matches the original room photo. The products should appear as if they naturally belong in the space with realistic proportions and placement.`);
            
            if (placementInstructions.trim()) {
                parts.push(`Follow these specific placement instructions: ${placementInstructions.trim()}. Ensure the product placement follows these guidelines while maintaining realism.`);
            } else {
                parts.push(`Place all products in natural, functional positions that enhance the room's aesthetics and usability. The AI should determine the best placement based on the room layout and design style.`);
            }
        }
        
        return parts.join(' ');
    };

    // Update prompt when selections change
    useEffect(() => {
        const autoPrompt = buildPromptFromSelections();
        if (autoPrompt) {
            setPrompt(autoPrompt);
        }
    }, [selectedWall, selectedFlooring, selectedFlooringSampleId, selectedFurnitureStyle, selectedStyle]);

    // Trigger generation when slider completes
    useEffect(() => {
        if (shouldGenerate) {
            setShouldGenerate(false);
            actuallyGenerate();
        }
    }, [shouldGenerate]);

    // Furniture images for the carousel
    const furnitureItems = [
        { id: 1, image: require('@/assets/img/Mueble1 Background Removed.png'), name: 'Sideboard 1' },
        { id: 2, image: require('@/assets/img/Mueble2 Background Removed.png'), name: 'Sideboard 2' },
        { id: 4, image: require('@/assets/img/Mueble4 Background Removed.png'), name: 'TV Stand' },
        { id: 5, image: require('@/assets/img/Mueble5 Background Removed.png'), name: 'Cabinet' },
        { id: 7, image: require('@/assets/img/Mueble7 Background Removed.png'), name: 'Wall Shelf' },
        { id: 9, image: require('@/assets/img/Mueble9 Background Removed.png'), name: 'Drawer Unit' },
        { id: 10, image: require('@/assets/img/Mueble10 Background Removed.png'), name: 'Low Cabinet' },
        { id: 12, image: require('@/assets/img/Mueble12 Background Removed.png'), name: 'Credenza' },
        { id: 13, image: require('@/assets/img/Mueble13 Background Removed.png'), name: 'Tall Cabinet' },
        { id: 15, image: require('@/assets/img/Mueble15 Background Removed.png'), name: 'Entertainment Unit' },
        { id: 17, image: require('@/assets/img/Mueble17 Background Removed.png'), name: 'Slatted Sideboard' },
        { id: 18, image: require('@/assets/img/Mueble18 Background Removed.png'), name: 'Oak Sideboard' },
        { id: 19, image: require('@/assets/img/Mueble19 Background Removed.png'), name: 'Slatted Cabinet' },
        { id: 20, image: require('@/assets/img/Mueble20 Background Removed.png'), name: 'Modular Shelf' },
        { id: 21, image: require('@/assets/img/Mueble21 Background Removed.png'), name: 'TV Console' },
        { id: 22, image: require('@/assets/img/Mueble22 Background Removed.png'), name: 'Geometric Shelf' },
        { id: 23, image: require('@/assets/img/Mueble23 Background Removed.png'), name: 'Fluted Cabinet' },
        { id: 24, image: require('@/assets/img/Mueble24 Background Removed.png'), name: 'Wood Sideboard' },
        { id: 25, image: require('@/assets/img/Mueble25 Background Removed.png'), name: 'Dark Shelf' },
        { id: 26, image: require('@/assets/img/Mueble26 Background Removed.png'), name: 'Walnut Console' },
        { id: 27, image: require('@/assets/img/Mueble27 Background Removed.png'), name: 'Console Table' },
        { id: 28, image: require('@/assets/img/Mueble28 Background Removed.png'), name: 'Display Cabinet' },
        { id: 29, image: require('@/assets/img/Mueble29 Background Removed.png'), name: 'Low TV Unit' },
        { id: 30, image: require('@/assets/img/Mueble30 Background Removed.png'), name: 'Floating Console' },
    ];

    const toggleFurnitureSelection = (id: number) => {
        setSelectedFurniture(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

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
            if (resultImage) {
                setProgress(100);
                progressAnim.setValue(1);
            }
        }
        
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [loading, resultImage]);

    // Convert image to JPEG format (OpenAI only accepts PNG, JPEG, WEBP)
    const convertImageToJpeg = async (uri: string): Promise<string> => {
        try {
            console.log('🔄 Converting image to JPEG:', uri);
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [], // No transformations, just convert format
                { 
                    compress: 0.9, 
                    format: ImageManipulator.SaveFormat.JPEG 
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
            setResultImage(null);
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
            setResultImage(null);
            setCurrentStep(2);
        }
    };

    // Upload additional images (furniture, floors, etc.)
    const uploadAdditionalImage = async () => {
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
            const jpegName = baseName.endsWith('.jpg') || baseName.endsWith('.jpeg') ? baseName : `${baseName}.jpg`;
            
            const newImage = {
                id: `upload_${Date.now()}_${Math.random()}`,
                uri: convertedUri,
                name: jpegName,
            };
            setUploadedImages([...uploadedImages, newImage]);
        }
    };

    // Remove uploaded image
    const removeUploadedImage = (imageId: string) => {
        setUploadedImages(uploadedImages.filter(img => img.id !== imageId));
    };

    // Tutorial carousel slides
    const tutorialSlides = [
        {
            id: '1',
            title: 'Take a Photo',
            description: 'Use your camera to capture the room you want to redesign. Make sure the lighting is good for best results.',
            icon: 'Camera' as const,
            iconColor: '#000',
            gradientColors: ['#fff', '#fff'] as [string, string],
            textColor: '#000',
            action: takePhoto,
        },
        {
            id: '2',
            title: 'Project Estimate',
            description: 'Get a detailed cost breakdown for your renovation project. Perfect for budget planning.',
            icon: 'Calculator' as const,
            iconColor: '#000',
            gradientColors: ['#fff', '#fff'] as [string, string],
            textColor: '#000',
            action: () => router.push('/screens/project-estimate'),
        },
        {
            id: '3',
            title: 'Choose from Gallery',
            description: 'Select an existing photo from your gallery. Pick a clear image that shows the full room.',
            icon: 'Image' as const,
            iconColor: '#000',
            gradientColors: ['#fff', '#fff'] as [string, string],
            textColor: '#000',
            action: pickImage,
        },
        ...(Platform.OS === 'ios' ? [
            {
                id: '4',
                title: 'Scan with AR',
                description: 'Use LiDAR to create an accurate 3D model of your room. Perfect for precise renovations.',
                icon: 'Scan' as const,
                iconColor: '#000',
                gradientColors: ['#fff', '#fff'] as [string, string],
                textColor: '#000',
                action: () => router.push('/screens/ar-room-scan'),
            },
            {
                id: '5',
                title: 'Augmented Reality',
                description: 'Get your space area, dimensions, and more from your AR scan.',
                icon: 'Box' as const,
                iconColor: '#000',
                gradientColors: ['#fff', '#fff'] as [string, string],
                textColor: '#000',
                action: () => router.push('/screens/ar-room-scan'),
            },
        ] : []),
    ];

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

    // Show recap screen before generating
    const handleGenerate = () => {
        setErrorDetails(null);

        if (!apiKey) {
            Alert.alert('Configuration Error', 'API key is not configured. Please contact support.');
            return;
        }
        if (!image) {
            Alert.alert('Image Missing', 'Please select an image to edit.');
            return;
        }
        if (!prompt) {
            Alert.alert('Prompt Missing', 'Please describe what you want to edit or generate.');
            return;
        }

        // Reset slider and show recap
        sliderPosition.setValue(0);
        setSliderCompleted(false);
        setShowRecap(true);
    };

    // Actually call the API
    const actuallyGenerate = async () => {
        setLoading(true);
        setResultImage(null);
        setCurrentStep(4);

        try {
            console.log('🚀 Starting image generation...');
            console.log('📦 Selected furniture items:', selectedFurnitureItems);

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

            if (selectedFlooringSample) {
                const asset = Image.resolveAssetSource(selectedFlooringSample.image);
                imagesArray.push({
                    uri: asset.uri,
                    name: `${selectedFlooringSample.id}.jpeg`,
                    type: 'image/jpeg',
                });
            }
            
            // Add furniture reference images if selected
            if (selectedFurnitureItems.length > 0) {
                selectedFurnitureItems.forEach((itemId) => {
                    const furnitureItem = furnitureReferenceItems.find(item => item.id === itemId);
                    if (furnitureItem) {
                        // Convert require() asset to URI
                        const asset = Image.resolveAssetSource(furnitureItem.image);
                        imagesArray.push({
                            uri: asset.uri,
                            name: `${itemId}.png`,
                            type: 'image/png',
                        });
                    }
                });
            }

            // Add user uploaded images (furniture, floors, decor, etc.)
            if (uploadedImages.length > 0) {
                uploadedImages.forEach((uploadedImg) => {
                    imagesArray.push({
                        uri: uploadedImg.uri,
                        name: uploadedImg.name,
                        type: 'image/jpeg',
                    });
                });
            }
            
            // Append images using array notation
            imagesArray.forEach((img) => {
                formData.append('image[]', img as any);
            });

            const flooringSampleCount = selectedFlooringSample ? 1 : 0;
            console.log(
                `📸 Sending ${imagesArray.length} images to API (room + ${flooringSampleCount} flooring sample + ${selectedFurnitureItems.length} furniture items + ${uploadedImages.length} uploaded products)`
            );
            
            // Enhanced prompt with furniture instructions
            const enhancedPrompt = buildPromptFromSelections();
            formData.append('prompt', enhancedPrompt);
            formData.append('input_fidelity', 'high');
            formData.append('n', '1');
            formData.append('size', '1024x1024');
            formData.append('model', 'gpt-image-1'); // Using 1.5 for better multi-image support

            const response = await fetch('https://api.openai.com/v1/images/edits', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: formData,
            });

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
                const imageData = data.data[0];
                if (imageData.url) {
                    setResultImage(imageData.url);
                } else if (imageData.b64_json) {
                    setResultImage(`data:image/png;base64,${imageData.b64_json}`);
                }
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
        setPrompt('');
        setResultImage(null);
        setCurrentStep(1);
        setErrorDetails(null);
        setSelectedFurniture([]);
        setSelectedWall('');
        setSelectedFlooring('');
        setSelectedFlooringSampleId(null);
        setSelectedFurnitureStyle('');
        setSelectedStyle('');
        setShowRecap(false);
        setSliderCompleted(false);
        setShouldGenerate(false);
        sliderPosition.setValue(0);
        setSelectedFurnitureItems([]);
        setPlacementInstructions('');
        setUploadedImages([]);
    };

    const handleDone = () => {
        Alert.alert(
            'Finished Session',
            'You can choose to save your renovation data or discard it.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Exit',
                    style: 'destructive',
                    onPress: () => {
                        resetAll();
                    },
                },
                {
                    text: 'Save & Exit',
                    onPress: async () => {
                        if (!image || !resultImage) {
                            Alert.alert('Error', 'No images to save.');
                            return;
                        }
                        try {
                            await saveDesign(image, resultImage, prompt);
                            Alert.alert('Saved!', 'Your design has been saved to My Designs.', [
                                { text: 'OK', onPress: () => { resetAll(); router.push('/(tabs)/my-designs'); } },
                            ]);
                        } catch (error) {
                            console.error('Failed to save design:', error);
                            Alert.alert('Error', 'Failed to save design. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Progress bar
    const ProgressBar = () => (
        <View className="flex-row gap-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
                <View
                    key={step}
                    className="flex-1 h-1 rounded-full"
                    style={{
                        backgroundColor: step <= currentStep 
                            ? colors.text 
                            : colors.border
                    }}
                />
            ))}
        </View>
    );


    return (
        <View 
            className="flex-1" 
            style={{ backgroundColor: colors.bg }}
        >
            {/* Header */}
            <View 
                className="flex-row items-center justify-between px-global py-4" 
                style={{ paddingTop: insets.top + 10 }}
            >
                {currentStep > 1 && !loading ? (
                    <Pressable onPress={goBack}>
                        <Icon name="ChevronLeft" size={24} color={colors.text} />
                    </Pressable>
                ) : (
                    <View className="w-6" />
                )}
                <ThemedText 
                    className="text-lg font-semibold"
                    style={{ color: colors.text }}
                >
                    Step {currentStep} / 4
                </ThemedText>
                <Pressable onPress={resetAll}>
                    <Icon name="X" size={24} color={colors.text} />
                </Pressable>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView 
                    contentContainerStyle={{ paddingBottom: 120 }} 
                    className="flex-1 px-global"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <ProgressBar />

                    {/* Step 1: Add Photo - Carousel Design */}
                    {currentStep === 1 && (
                        <View className="flex-1 -mx-global" style={{ marginTop: 40}}>
                            {/* Carousel */}
                            <FlatList
                                ref={carouselRef}
                                data={tutorialSlides}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={SCREEN_WIDTH}
                                decelerationRate="fast"
                                onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                                    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                                    setCarouselIndex(index);
                                }}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <View 
                                        style={{ width: SCREEN_WIDTH }}
                                        className="items-center justify-center px-6 py-6"
                                    >
                                        {/* Liquid Glass Card */}
                                        <View style={[liquidGlassStyles.cardOuter, { width: CARD_WIDTH }]}>
    <BlurView
        intensity={45}
        tint={colors.isDark ? "dark" : "light"}
        style={liquidGlassStyles.cardBlur}
    >
        {/* Glass overlay gradient */}
        <LinearGradient
            colors={glassGradients.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
        />

        {/* Top highlight line */}
        <View style={liquidGlassStyles.topHighlight} />

        {/* Content */}
        <View style={liquidGlassStyles.cardContent}>
            {/* Icon in glass circle */}
            <View style={liquidGlassStyles.iconContainer}>
                <BlurView
                    intensity={60}
                    tint={colors.isDark ? "dark" : "light"}
                    style={liquidGlassStyles.iconBlur}
                >
                    <LinearGradient
                        colors={glassGradients.icon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />

                    <Icon
                        name={item.icon}
                        size={56}
                        color={colors.text}
                    />
                </BlurView>
            </View>

                                                    {/* Title */}
                                                    <ThemedText style={liquidGlassStyles.title}>
                                                        {item.title}
                            </ThemedText>
                                                    
                                                    {/* Description */}
                                                    <ThemedText style={liquidGlassStyles.description}>
                                                        {item.description}
                            </ThemedText>

                                                    {/* Glass Action Button */}
                            <Pressable 
                                                        onPress={item.action}
                                                        style={liquidGlassStyles.actionButton}
                                                    >
                                                       <BlurView
    intensity={80}
    tint={colors.isDark ? "dark" : "light"}
    style={liquidGlassStyles.buttonBlur}
>
    <LinearGradient
        colors={glassGradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
    />

    <View style={liquidGlassStyles.buttonContent}>
        <ThemedText style={liquidGlassStyles.buttonText}>
            Select
                                </ThemedText>

        <Icon
            name="ArrowRight"
            size={18}
            color={colors.text}
        />
                                </View>
</BlurView>
                            </Pressable>

                                                    {/* Skip/Next hint */}
                                                    {index < tutorialSlides.length - 1 && (
                                <Pressable 
                                                            onPress={() => {
                                                                carouselRef.current?.scrollToIndex({ index: index + 1, animated: true });
                                                            }}
                                                            className="py-3 items-center"
                                                        >
                                                            <ThemedText style={liquidGlassStyles.skipText}>
                                                                Swipe for more →
                                                            </ThemedText>
                                </Pressable>
                            )}
                                    </View>
                                            </BlurView>
                                </View>
                                        </View>
                                )}
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
                                            backgroundColor: carouselIndex === index
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
                            <ThemedText className="text-2xl font-bold mb-2">Your Photo</ThemedText>
                            <ThemedText className="text-light-subtext dark:text-dark-subtext mb-6">
                                This is the room you want to redesign
                            </ThemedText>

                            <View className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-border mb-6">
                                <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                                <Pressable
                                    onPress={() => {
                                        setImage(null);
                                        setCurrentStep(1);
                                    }}
                                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                                >
                                    <Icon name="X" size={20} color="white" />
                                </Pressable>
                            </View>

                            <Button
                                title="Continue"
                                variant="primary"
                                size="large"
                                onPress={() => setCurrentStep(3)}
                            />
                        </AnimatedView>
                    )}

                    {/* Step 3: Describe Changes */}
                    {currentStep === 3 && (
                        <AnimatedView animation="fadeInUp">
                            <ThemedText className="text-2xl font-bold mb-2">Describe Your Vision</ThemedText>
                            

                            {image && (
                                <View className="w-full h-96 rounded-2xl overflow-hidden border border-border mb-4">
                                    <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                                </View>
                            )}

                            <TextInput
                                value={prompt}
                                onChangeText={setPrompt}
                                placeholder="Modern minimalist style with warm wooden tones, clean lines, and natural lighting..."
                                placeholderTextColor={colors.placeholder}
                                className="bg-secondary p-4 rounded-xl text-text border border-border text-base min-h-[120px] mb-6"
                                multiline
                                textAlignVertical="top"
                            />

                            {/* Design Options */}
                            <ThemedText className="font-semibold mb-3">Customize Your Design (</ThemedText> 
                            <View className="gap-3 mb-6">
                                {/* Style Dropdown */}
                                    <Pressable 
                                    onPress={() => setShowStylePicker(true)}
                                    className="flex-row items-center justify-between bg-secondary p-4 rounded-xl border border-border"
                                >
                                    <View className="flex-row items-center gap-3">
                                        <Icon name="Sparkles" size={20} color={colors.highlight} />
                                        <View>
                                            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Style</ThemedText>
                                            <ThemedText className="font-medium">
                                                {selectedStyle || 'Select style...'}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <Icon name="ChevronDown" size={20} color={colors.placeholder} />
                                    </Pressable>

                                {/* Walls Dropdown */}
                                <Pressable
                                    onPress={() => setShowWallPicker(true)}
                                    className="flex-row items-center justify-between bg-secondary p-4 rounded-xl border border-border"
                                >
                                    <View className="flex-row items-center gap-3">
                                        <Icon name="Square" size={20} color={colors.highlight} />
                                        <View>
                                            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Walls</ThemedText>
                                            <ThemedText className="font-medium">
                                                {selectedWall || 'Select wall finish...'}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <Icon name="ChevronDown" size={20} color={colors.placeholder} />
                                </Pressable>

                                {/* Flooring Dropdown */}
                                <Pressable
                                    onPress={() => setShowFlooringPicker(true)}
                                    className="flex-row items-center justify-between bg-secondary p-4 rounded-xl border border-border"
                                >
                                    <View className="flex-row items-center gap-3">
                                        {selectedFlooringSample ? (
                                            <View className="w-9 h-9 rounded-lg overflow-hidden border border-border">
                                                <Image
                                                    source={selectedFlooringSample.image}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        ) : (
                                            <Icon name="Grid3x3" size={20} color={colors.highlight} />
                                        )}
                                        <View>
                                            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Flooring</ThemedText>
                                            <ThemedText className="font-medium">
                                                {selectedFlooring || 'Select flooring...'}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <Icon name="ChevronDown" size={20} color={colors.placeholder} />
                                </Pressable>

                                {/* Furniture Style Dropdown */}
                                <Pressable
                                    onPress={() => setShowFurnitureStylePicker(true)}
                                    className="flex-row items-center justify-between bg-secondary p-4 rounded-xl border border-border"
                                >
                                    <View className="flex-row items-center gap-3">
                                        <Icon name="Armchair" size={20} color={colors.highlight} />
                                        <View>
                                            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Furniture</ThemedText>
                                            <ThemedText className="font-medium">
                                                {selectedFurnitureStyle || 'Select furniture style...'}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <Icon name="ChevronDown" size={20} color={colors.placeholder} />
                                </Pressable>
                            </View>

                            {/* Furniture Reference Selection */}
                            <View className="mb-6">
                                <ThemedText className="font-semibold mb-3">Add Furniture to Your Room</ThemedText>
                                <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mb-4">
                                    Select furniture pieces to place in your room. The AI will integrate them naturally into the design.
                                </ThemedText>
                                
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingRight: 24, gap: 12 }}
                                >
                                    {furnitureReferenceItems.map((item) => {
                                        const isSelected = selectedFurnitureItems.includes(item.id);
                                        return (
                                            <Pressable
                                                key={item.id}
                                                onPress={() => {
                                                    if (isSelected) {
                                                        setSelectedFurnitureItems(selectedFurnitureItems.filter(id => id !== item.id));
                                                    } else {
                                                        setSelectedFurnitureItems([...selectedFurnitureItems, item.id]);
                                                    }
                                                }}
                                                className="items-center"
                                                style={{ width: 120 }}
                                            >
                                                <View 
                                                    className={`rounded-2xl overflow-hidden border-2 mb-2 ${
                                                        isSelected ? 'border-highlight' : 'border-border'
                                                    }`}
                                                    style={{
                                                        width: 120,
                                                        height: 120,
                                                        backgroundColor: colors.secondary,
                                                    }}
                                                >
                                                    <Image 
                                                        source={item.image} 
                                                        style={{ width: '100%', height: '100%' }}
                                                        resizeMode="contain"
                                                    />
                                                    {isSelected && (
                                                        <View className="absolute top-2 right-2 w-6 h-6 bg-highlight rounded-full items-center justify-center">
                                                            <Icon name="Check" size={14} color="#FFFFFF" />
                                                        </View>
                                                    )}
                                                </View>
                                                <ThemedText className="text-xs text-center" numberOfLines={2}>
                                                    {item.name}
                                                </ThemedText>
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>

                                {/* Placement Instructions (shown only if furniture is selected) */}
                                {selectedFurnitureItems.length > 0 && (
                                    <View className="mt-4">
                                        <ThemedText className="text-sm font-medium mb-2">
                                            Placement Instructions (Optional)
                                        </ThemedText>
                                        <TextInput
                                            value={placementInstructions}
                                            onChangeText={setPlacementInstructions}
                                            placeholder="e.g., Place furniture against the wall, Arrange in the center of the room..."
                                            placeholderTextColor={colors.placeholder}
                                            className="bg-secondary p-3 rounded-xl text-text border border-border text-sm min-h-[80px]"
                                            multiline
                                            textAlignVertical="top"
                                        />
                                        <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mt-1">
                                            Leave empty to let AI place furniture naturally
                                        </ThemedText>
                                    </View>
                                )}
                            </View>

                            {/* User Uploaded Products Section */}
                            <View className="mb-6">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View>
                                        <ThemedText className="font-semibold">Upload Your Products</ThemedText>
                                        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                                            Upload furniture, flooring, or decor images to place in your room
                                        </ThemedText>
                                    </View>
                                    <Pressable
                                        onPress={uploadAdditionalImage}
                                        className="bg-highlight px-4 py-2 rounded-full flex-row items-center gap-2"
                                    >
                                        <Icon name="Plus" size={18} color="#FFFFFF" />
                                        <ThemedText className="text-white font-medium text-sm">Upload</ThemedText>
                                    </Pressable>
                                </View>

                                {uploadedImages.length > 0 && (
                                    <ScrollView 
                                        horizontal 
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingRight: 24, gap: 12 }}
                                    >
                                        {uploadedImages.map((uploadedImg) => (
                                            <View key={uploadedImg.id} className="items-center" style={{ width: 120 }}>
                                                <View className="relative">
                                                    <View 
                                                        className="rounded-2xl overflow-hidden border-2 border-highlight"
                                                        style={{
                                                            width: 120,
                                                            height: 120,
                                                            backgroundColor: colors.secondary,
                                                        }}
                                                    >
                                                        <Image 
                                                            source={{ uri: uploadedImg.uri }} 
                                                            style={{ width: '100%', height: '100%' }}
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                    <Pressable
                                                        onPress={() => removeUploadedImage(uploadedImg.id)}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                                                    >
                                                        <Icon name="X" size={12} color="#FFFFFF" />
                                                    </Pressable>
                                                </View>
                                                <ThemedText className="text-xs text-center mt-2" numberOfLines={2}>
                                                    {uploadedImg.name}
                                                </ThemedText>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}

                                {uploadedImages.length === 0 && (
                                    <View className="border-2 border-dashed border-border rounded-2xl p-8 items-center justify-center">
                                        <Icon name="Image" size={32} color={colors.placeholder} />
                                        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-2 text-center">
                                            No products uploaded yet. Tap "Upload" to add furniture or decor items.
                                        </ThemedText>
                                    </View>
                                )}
                            </View>

                            {errorDetails && (
                                <View className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-4">
                                    <ThemedText className="text-sm text-red-500">{errorDetails}</ThemedText>
                                </View>
                            )}

                            <Button
                                title="Generate Design"
                                variant="primary"
                                size="large"
                                disabled={!prompt}
                                onPress={handleGenerate}
                            />
                        </AnimatedView>
                    )}

                    {/* Step 4: Processing / Result */}
                    {currentStep === 4 && (
                        <AnimatedView animation="fadeInUp">
                            {loading ? (
                                <View className="items-center py-16">
                                    <View className="w-36 h-36 rounded-3xl overflow-hidden mb-8 border border-border">
                                        {image && <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />}
                                    </View>
                                    
                                    {/* Progress Bar */}
                                    <View className="w-full mb-4">
                                        <View className="h-2 bg-border rounded-full overflow-hidden">
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
                                        <View className="flex-row justify-between mt-2">
                                            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                                                {progress}%
                                            </ThemedText>
                                            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                                                ~{Math.max(0, Math.ceil((100 - progress) * 0.6))}s remaining
                                            </ThemedText>
                                        </View>
                                    </View>
                                    
                                    <ActivityIndicator size="small" color={colors.highlight} className="mb-3" />
                                    <ThemedText className="text-2xl font-semibold mb-2">Processing...</ThemedText>
                                    <ThemedText className="text-light-subtext dark:text-dark-subtext text-center px-4">
                                        AI is transforming your room. Please don't close the app.
                                    </ThemedText>
                                </View>
                            ) : resultImage ? (
                                <>
                                    <ThemedText className="text-2xl font-bold mb-4">Your Redesigned Room</ThemedText>
                                    
                                    {/* Before */}
                                    <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mb-2">Before</ThemedText>
                                    <View className="h-40 rounded-2xl overflow-hidden border border-border mb-4">
                                        <Image source={{ uri: image! }} className="w-full h-full" resizeMode="cover" />
                                    </View>

                                    {/* After */}
                                    <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mb-2">After</ThemedText>
                                    <View className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-secondary mb-6">
                                        <Image source={{ uri: resultImage }} className="w-full h-full" resizeMode="cover" />
                                        {/* Fullscreen button */}
                                        <Pressable
                                            onPress={() => setShowFullscreen(true)}
                                            className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-lg"
                                        >
                                            <Icon name="Maximize2" size={18} color="white" />
                                        </Pressable>
                                    </View>

                                    <View className="flex-row gap-3">
                                        <Button
                                            title="Try Again"
                                            variant="ghost"
                                            className="flex-1"
                                            onPress={() => setCurrentStep(3)}
                                        />
                                        <Button
                                            title="Done"
                                            variant="primary"
                                            className="flex-1"
                                            onPress={handleDone}
                                        />
                                    </View>
                                </>
                            ) : (
                                <View className="items-center py-20">
                                    <Icon name="AlertCircle" size={48} color={colors.placeholder} />
                                    <ThemedText className="text-xl font-semibold mt-4 mb-2">Something went wrong</ThemedText>
                                    <ThemedText className="text-light-subtext dark:text-dark-subtext text-center mb-6">
                                        {errorDetails || 'Please try again'}
                                    </ThemedText>
                                    <Button
                                        title="Try Again"
                                        variant="primary"
                                        onPress={() => setCurrentStep(3)}
                                    />
                                </View>
                            )}
                        </AnimatedView>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Fullscreen Image Modal */}
            <Modal
                visible={showFullscreen}
                transparent
                animationType="fade"
                onRequestClose={() => setShowFullscreen(false)}
            >
                <View className="flex-1 bg-black">
                    {/* Close button */}
                    <Pressable
                        onPress={() => setShowFullscreen(false)}
                        className="absolute top-4 right-4 z-10 bg-white/20 p-3 rounded-full"
                        style={{ top: insets.top + 10 }}
                    >
                        <Icon name="X" size={24} color="white" />
                    </Pressable>
                    
                    {/* Fullscreen image */}
                    {resultImage && (
                        <Image
                            source={{ uri: resultImage }}
                            className="flex-1"
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>

            {/* Recap Screen Modal */}
            <Modal
                visible={showRecap}
                animationType="fade"
                onRequestClose={() => setShowRecap(false)}
            >
                <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: insets.top + 20 }}>
                    {/* Close button */}
                    <Pressable
                        onPress={() => setShowRecap(false)}
                        className="absolute top-4 left-4 z-10 p-3"
                        style={{ top: insets.top + 10 }}
                    >
                        <Icon name="X" size={24} color={colors.text} />
                    </Pressable>

                    {/* Content */}
                    <View className="flex-1 px-6 pt-16">
                        <ThemedText className="text-4xl font-bold mb-8" style={{ color: colors.text }}>
                            Let's recap...
                        </ThemedText>

                        {/* Selected options list */}
                        <View className="gap-4">
                            {selectedStyle && (
                                <View className="flex-row items-center gap-3">
                                    <View className="w-4 h-4 rounded-full" style={{ backgroundColor: '#9B744D' }} />
                                    <ThemedText className="text-lg" style={{ color: colors.text }}>
                                        {selectedStyle} Style
                                    </ThemedText>
                                </View>
                            )}
                            {selectedWall && (
                                <View className="flex-row items-center gap-3">
                                    <View className="w-4 h-4 rounded-full" style={{ backgroundColor: '#B8A182' }} />
                                    <ThemedText className="text-lg" style={{ color: colors.text }}>
                                        {selectedWall} Wall Paint
                                    </ThemedText>
                                </View>
                            )}
                            {selectedFlooring && (
                                <View className="flex-row items-center gap-3">
                                    <View className="w-4 h-4 rounded-full" style={{ backgroundColor: '#75523C' }} />
                                    <ThemedText className="text-lg" style={{ color: colors.text }}>
                                        {selectedFlooring} floor
                                    </ThemedText>
                                </View>
                            )}
                            {selectedFurnitureStyle && (
                                <View className="flex-row items-center gap-3">
                                    <View className="w-4 h-4 rounded-full" style={{ backgroundColor: '#D2C6B6' }} />
                                    <ThemedText className="text-lg" style={{ color: colors.text }}>
                                        {selectedFurnitureStyle} Furniture
                                    </ThemedText>
                                </View>
                            )}
                            {(selectedFurnitureItems.length > 0 || uploadedImages.length > 0) && (
                                <View className="gap-2">
                                    <ThemedText className="text-sm font-medium" style={{ color: colors.text, opacity: 0.8 }}>
                                        Selected Products ({selectedFurnitureItems.length + uploadedImages.length}):
                                    </ThemedText>
                                    <View className="flex-row flex-wrap gap-2">
                                        {selectedFurnitureItems.map((itemId) => {
                                            const item = furnitureReferenceItems.find(i => i.id === itemId);
                                            return item ? (
                                                <View key={itemId} className="flex-row items-center gap-2 bg-secondary/50 px-3 py-2 rounded-full">
                                                    <View className="w-6 h-6 rounded overflow-hidden">
                                                        <Image source={item.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                                    </View>
                                                    <ThemedText className="text-sm" style={{ color: colors.text }}>
                                                        {item.name}
                                                    </ThemedText>
                                                </View>
                                            ) : null;
                                        })}
                                        {uploadedImages.map((uploadedImg) => (
                                            <View key={uploadedImg.id} className="flex-row items-center gap-2 bg-secondary/50 px-3 py-2 rounded-full">
                                                <View className="w-6 h-6 rounded overflow-hidden">
                                                    <Image source={{ uri: uploadedImg.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                                </View>
                                                <ThemedText className="text-sm" style={{ color: colors.text }}>
                                                    {uploadedImg.name}
                                                </ThemedText>
                                            </View>
                                        ))}
                                    </View>
                                    {placementInstructions.trim() && (
                                        <View className="mt-2 bg-secondary/30 p-3 rounded-xl">
                                            <ThemedText className="text-xs font-medium mb-1" style={{ color: colors.text, opacity: 0.7 }}>
                                                Placement Instructions:
                                            </ThemedText>
                                            <ThemedText className="text-sm" style={{ color: colors.text }}>
                                                {placementInstructions}
                                            </ThemedText>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Swipe to confirm slider */}
                    <View 
                        className="px-6 pb-8"
                        style={{ paddingBottom: insets.bottom + 20 }}
                    >
                        <View 
                            className="h-20 rounded-full overflow-hidden"
                            style={{ 
                                backgroundColor: colors.secondary,
                                width: SLIDER_WIDTH,
                                alignSelf: 'center',
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            {/* Track text */}
                            <View className="absolute inset-0 items-center justify-center flex-row gap-2">
                                <ThemedText className="text-gray-500 font-medium text-lg">
                                    I'm ready
                                </ThemedText>
                            </View>
                            
                            {/* Slider button */}
                            <Animated.View
                                {...panResponder.panHandlers}
                                style={{
                                    position: 'absolute',
                                    left: 4,
                                    top: 4,
                                    width: SLIDER_BUTTON_SIZE,
                                    height: SLIDER_BUTTON_SIZE,
                                    borderRadius: SLIDER_BUTTON_SIZE / 2,
                                    backgroundColor: '#9B744D',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: [{ translateX: sliderPosition }],
                                    shadowColor: '#9B744D',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                }}
                            >
                                <Icon name="ChevronRight" size={28} color="#FFFFFF" />
                            </Animated.View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Style Picker Modal */}
            <Modal
                visible={showStylePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowStylePicker(false)}
            >
                <Pressable 
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setShowStylePicker(false)}
                >
                    <View 
                        className="bg-background rounded-t-3xl max-h-[70%]"
                        style={{ paddingBottom: insets.bottom + 20 }}
                    >
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <ThemedText className="text-lg font-bold">Select Style</ThemedText>
                            <Pressable onPress={() => setShowStylePicker(false)}>
                                <Icon name="X" size={24} color={colors.text} />
                            </Pressable>
                        </View>
                        <ScrollView className="p-4">
                            {STYLE_OPTIONS.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() => {
                                        setSelectedStyle(option);
                                        setShowStylePicker(false);
                                    }}
                                    className={`p-4 rounded-xl mb-2 ${
                                        selectedStyle === option ? 'bg-highlight/20' : 'bg-secondary'
                                    }`}
                                    style={selectedStyle === option ? { borderWidth: 1, borderColor: colors.highlight } : {}}
                                >
                                    <ThemedText className={selectedStyle === option ? 'font-semibold' : ''}>
                                        {option}
                                    </ThemedText>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

            {/* Wall Picker Modal */}
            <Modal
                visible={showWallPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowWallPicker(false)}
            >
                <Pressable 
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setShowWallPicker(false)}
                >
                    <View 
                        className="bg-background rounded-t-3xl max-h-[70%]"
                        style={{ paddingBottom: insets.bottom + 20 }}
                    >
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <ThemedText className="text-lg font-bold">Select Wall Finish</ThemedText>
                            <Pressable onPress={() => setShowWallPicker(false)}>
                                <Icon name="X" size={24} color={colors.text} />
                            </Pressable>
                        </View>
                        <ScrollView className="p-4">
                            {WALL_OPTIONS.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() => {
                                        setSelectedWall(option);
                                        setShowWallPicker(false);
                                    }}
                                    className={`p-4 rounded-xl mb-2 ${
                                        selectedWall === option ? 'bg-highlight/20' : 'bg-secondary'
                                    }`}
                                    style={selectedWall === option ? { borderWidth: 1, borderColor: colors.highlight } : {}}
                                >
                                    <ThemedText className={selectedWall === option ? 'font-semibold' : ''}>
                                        {option}
                                    </ThemedText>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

            {/* Flooring Picker Modal */}
            <Modal
                visible={showFlooringPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFlooringPicker(false)}
            >
                <Pressable 
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setShowFlooringPicker(false)}
                >
                    <View 
                        className="bg-background rounded-t-3xl max-h-[70%]"
                        style={{ paddingBottom: insets.bottom + 20 }}
                    >
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <ThemedText className="text-lg font-bold">Select Flooring</ThemedText>
                            <Pressable onPress={() => setShowFlooringPicker(false)}>
                                <Icon name="X" size={24} color={colors.text} />
                            </Pressable>
                        </View>
                        <ScrollView className="p-4">
                            <Pressable
                                onPress={() => {
                                    setSelectedFlooring('');
                                    setSelectedFlooringSampleId(null);
                                    setShowFlooringPicker(false);
                                }}
                                className="p-3 rounded-xl border border-dashed border-border mb-4 items-center"
                            >
                                <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                                    No preference
                                </ThemedText>
                            </Pressable>

                            <ThemedText className="text-sm font-semibold mb-3">Flooring samples</ThemedText>
                            <View className="flex-row flex-wrap gap-3">
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
                                            className="w-[48%] mb-2"
                                        >
                                            <View
                                                className={`rounded-2xl overflow-hidden border-2 ${
                                                    isSelected ? 'border-highlight' : 'border-border'
                                                }`}
                                                style={{ backgroundColor: colors.secondary }}
                                            >
                                                <Image
                                                    source={item.image}
                                                    style={{ width: '100%', height: 120 }}
                                                    resizeMode="cover"
                                                />
                                                {isSelected && (
                                                    <View className="absolute top-2 right-2 w-6 h-6 bg-highlight rounded-full items-center justify-center">
                                                        <Icon name="Check" size={14} color="#FFFFFF" />
                                                    </View>
                                                )}
                                            </View>
                                            <ThemedText className="text-sm font-medium mt-2 text-center">
                                                {item.name}
                                            </ThemedText>
                                        </Pressable>
                                    );
                                })}
                            </View>

                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

            {/* Furniture Style Picker Modal */}
            <Modal
                visible={showFurnitureStylePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFurnitureStylePicker(false)}
            >
                <Pressable 
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setShowFurnitureStylePicker(false)}
                >
                    <View 
                        className="bg-background rounded-t-3xl max-h-[70%]"
                        style={{ paddingBottom: insets.bottom + 20 }}
                    >
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <ThemedText className="text-lg font-bold">Select Furniture Style</ThemedText>
                            <Pressable onPress={() => setShowFurnitureStylePicker(false)}>
                                <Icon name="X" size={24} color={colors.text} />
                            </Pressable>
                        </View>
                        <ScrollView className="p-4">
                            {FURNITURE_STYLE_OPTIONS.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() => {
                                        setSelectedFurnitureStyle(option);
                                        setShowFurnitureStylePicker(false);
                                    }}
                                    className={`p-4 rounded-xl mb-2 ${
                                        selectedFurnitureStyle === option ? 'bg-highlight/20' : 'bg-secondary'
                                    }`}
                                    style={selectedFurnitureStyle === option ? { borderWidth: 1, borderColor: colors.highlight } : {}}
                                >
                                    <ThemedText className={selectedFurnitureStyle === option ? 'font-semibold' : ''}>
                                        {option}
                                    </ThemedText>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
