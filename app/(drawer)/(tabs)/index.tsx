import React, { useState } from 'react';
import { View, Image, Pressable, ScrollView, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import AnimatedView from '@/components/AnimatedView';
import useThemeColors from '@/app/contexts/ThemeColors';

// API Key from environment variable
const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

// Room area options
const ROOM_AREAS = [
    { id: '10-20', label: '10-20 m²' },
    { id: '20-30', label: '20-30 m²' },
    { id: '30-50', label: '30-50 m²' },
    { id: '50-80', label: '50-80 m²' },
    { id: '80-100', label: '80-100 m²' },
    { id: '100+', label: '100+ m²' },
] as const;

// Wall style options
const WALL_STYLES = [
    { id: 'favela', label: 'Favela' },
    { id: 'metacrilato', label: 'Metacrilato' },
    { id: 'sis-tawook', label: 'Sis Tawook' },
    { id: 'masala-paint', label: 'Masala Paint' },
] as const;

// Furniture options
const FURNITURE_OPTIONS = [
    { id: 'none', label: 'No Furniture' },
    { id: 'ikea', label: 'IKEA' },
    { id: 'the-curve', label: 'The Curve' },
    { id: 'west-elm', label: 'West Elm' },
    { id: 'kolkata-bazaar', label: 'Kolkata Bazaar' },
] as const;

// Preferences option
const PREFERENCES_OPTIONS = [
    { id: 'disregard', label: 'All your previous preferences will be disregarded' },
] as const;

// Indian design styles with subtle prompts
const DESIGN_STYLES = [
    { 
        id: 'kochi', 
        label: 'Kochi Style', 
        description: 'Coastal Kerala elegance with wooden accents',
        prompt: 'subtle Kochi-inspired style with warm wooden tones, clean lines, and a hint of coastal freshness. Keep it modern with understated traditional touches'
    },
    { 
        id: 'udaipur', 
        label: 'Udaipur Traditional', 
        description: 'Royal Rajasthani heritage aesthetics',
        prompt: 'elegant Udaipur-inspired style with soft earth tones, minimal ornate details, and refined heritage accents. Keep the overall look contemporary and sophisticated'
    },
    { 
        id: 'trivandrum', 
        label: 'Trivandrum Vibes', 
        description: 'South Indian temple-inspired serenity',
        prompt: 'serene Trivandrum-inspired style with natural materials, peaceful ambiance, and subtle architectural details. Maintain a calm, minimalist aesthetic'
    },
    { 
        id: 'calicut', 
        label: 'Calicut Serenity', 
        description: 'Malabar coastal tranquility',
        prompt: 'tranquil Calicut-inspired style with light wooden elements, airy feel, and gentle coastal touches. Keep the design clean and uncluttered'
    },
] as const;

type Step = 'welcome' | 'style' | 'upload' | 'details' | 'processing' | 'result';

// Dropdown component
const Dropdown = ({ 
    label, 
    value, 
    options, 
    onSelect, 
    placeholder 
}: { 
    label: string;
    value: string | null;
    options: readonly { id: string; label: string }[];
    onSelect: (id: string) => void;
    placeholder: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const colors = useThemeColors();
    
    const selectedOption = options.find(o => o.id === value);
    
    return (
        <View className="mb-4">
            <ThemedText className="font-semibold mb-2">{label}</ThemedText>
            <Pressable
                onPress={() => setIsOpen(true)}
                className="bg-secondary p-4 rounded-xl flex-row items-center justify-between border border-border"
            >
                <ThemedText className={selectedOption ? '' : 'text-light-subtext dark:text-dark-subtext'}>
                    {selectedOption?.label || placeholder}
                </ThemedText>
                <Icon name="ChevronDown" size={20} color={colors.text} />
            </Pressable>
            
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable 
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setIsOpen(false)}
                >
                    <View className="bg-background rounded-t-3xl max-h-[60%]">
                        <View className="p-4 border-b border-border flex-row items-center justify-between">
                            <ThemedText className="text-lg font-bold">{label}</ThemedText>
                            <Pressable onPress={() => setIsOpen(false)}>
                                <Icon name="X" size={24} color={colors.text} />
                            </Pressable>
                        </View>
                        <ScrollView className="p-4">
                            {options.map((option) => (
                                <Pressable
                                    key={option.id}
                                    onPress={() => {
                                        onSelect(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={`p-4 rounded-xl mb-2 ${
                                        value === option.id ? 'bg-highlight' : 'bg-secondary'
                                    }`}
                                >
                                    <ThemedText className={value === option.id ? 'text-white font-semibold' : ''}>
                                        {option.label}
                                    </ThemedText>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default function HomeScreen() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();

    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [image, setImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState(API_KEY);
    const [error, setError] = useState<string | null>(null);
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    
    // Form fields
    const [roomArea, setRoomArea] = useState<string | null>(null);
    const [wallStyle, setWallStyle] = useState<string | null>(null);
    const [furniture, setFurniture] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<string | null>(null);

    const getStepNumber = () => {
        switch (currentStep) {
            case 'style': return 1;
            case 'upload': return 2;
            case 'details': return 3;
            case 'processing': return 4;
            default: return 0;
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleGenerate = async () => {
        if (!apiKey) {
            Alert.alert('API Key Missing', 'Please tap the settings icon to enter your OpenAI API key.');
            setShowApiKeyInput(true);
            setCurrentStep('welcome');
            return;
        }

        setCurrentStep('processing');
        setError(null);

        try {
            const styleData = DESIGN_STYLES.find(s => s.id === selectedStyle);
            const wallData = WALL_STYLES.find(w => w.id === wallStyle);
            const furnitureData = FURNITURE_OPTIONS.find(f => f.id === furniture);
            
            const prompt = `Redesign this room with ${styleData?.prompt || 'a warm, elegant style'}. ${
                wallData ? `Use ${wallData.label} wall finish.` : ''
            } ${
                furnitureData && furnitureData.id !== 'none' ? `Include ${furnitureData.label} style furniture.` : 'Keep the space minimal without heavy furniture.'
            } Maintain the original room layout and structure. Add tasteful design elements that feel sophisticated and inviting. The result should look realistic, professionally designed, and livable.`;

            console.log('🚀 Starting home renovation generation...');
            console.log('📝 Prompt:', prompt);

            const formData = new FormData();
            formData.append('image', {
                uri: image,
                name: 'room.png',
                type: 'image/png',
            } as any);
            formData.append('prompt', prompt);
            formData.append('n', '1');
            formData.append('size', '1024x1024');
            formData.append('model', 'gpt-image-1');

            const response = await fetch('https://api.openai.com/v1/images/edits', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: formData,
            });

            console.log('📥 Response status:', response.status);

            const responseText = await response.text();
            let data;
            
            try {
                data = JSON.parse(responseText);
            } catch {
                throw new Error('Failed to parse API response');
            }

            if (!response.ok || data.error) {
                console.error('❌ API Error:', data.error);
                throw new Error(data.error?.message || 'API request failed');
            }

            if (data.data && data.data.length > 0) {
                console.log('✅ Success! Image generated.');
                const imageData = data.data[0];
                if (imageData.url) {
                    setResultImage(imageData.url);
                } else if (imageData.b64_json) {
                    setResultImage(`data:image/png;base64,${imageData.b64_json}`);
                }
                setCurrentStep('result');
            } else {
                throw new Error('No image returned from API');
            }
        } catch (err: any) {
            console.error('❌ Error:', err);
            setError(err.message || 'An error occurred');
            Alert.alert('Error', err.message || 'Failed to generate image');
            setCurrentStep('details');
        }
    };

    const resetFlow = () => {
        setCurrentStep('welcome');
        setImage(null);
        setSelectedStyle(null);
        setResultImage(null);
        setError(null);
        setRoomArea(null);
        setWallStyle(null);
        setFurniture(null);
        setPreferences(null);
    };

    // Progress bar component
    const ProgressBar = () => (
        <View className="flex-row gap-2 px-global mb-4">
            {[1, 2, 3, 4].map((step) => (
                <View
                    key={step}
                    className={`flex-1 h-1 rounded-full ${
                        step <= getStepNumber() ? 'bg-text' : 'bg-border'
                    }`}
                />
            ))}
        </View>
    );

    // Header for step screens
    const StepHeader = ({ title }: { title: string }) => (
        <View className="flex-row items-center justify-between px-global py-4">
            {getStepNumber() > 1 ? (
                <Pressable onPress={() => {
                    if (currentStep === 'upload') setCurrentStep('style');
                    if (currentStep === 'details') setCurrentStep('upload');
                }}>
                    <Icon name="ChevronLeft" size={24} color={colors.text} />
                </Pressable>
            ) : (
                <View className="w-6" />
            )}
            <ThemedText className="text-lg font-semibold">{title}</ThemedText>
            <Pressable onPress={resetFlow}>
                <Icon name="X" size={24} color={colors.text} />
            </Pressable>
        </View>
    );

    // Welcome Screen
    if (currentStep === 'welcome') {
        return (
            <View className="flex-1 bg-background">
                <View className="flex-row items-center justify-between px-global py-4" style={{ paddingTop: insets.top + 10 }}>
                    <ThemedText className="text-xl font-bold">Bianco.ai Home Renovations</ThemedText>
                    <Pressable onPress={() => setShowApiKeyInput(!showApiKeyInput)}>
                        <Icon name="Settings" size={24} color={colors.text} />
                    </Pressable>
                </View>

                <ScrollView className="flex-1 px-global">
                    {showApiKeyInput && (
                        <AnimatedView animation="fadeInDown" className="mb-4 bg-secondary p-4 rounded-xl border border-border">
                            <ThemedText className="font-semibold mb-2">OpenAI API Key</ThemedText>
                            <TextInput
                                value={apiKey}
                                onChangeText={setApiKey}
                                placeholder="sk-..."
                                placeholderTextColor={colors.placeholder}
                                className="bg-background p-3 rounded-lg text-text border border-border"
                                secureTextEntry
                            />
                            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mt-2">
                                Your key is used locally to generate images.
                            </ThemedText>
                        </AnimatedView>
                    )}

                    <AnimatedView animation="fadeInUp" className="mt-4">
                        {/* Bianco.ai Hero Image */}
                        <View className="rounded-3xl overflow-hidden shadow-lg mb-6">
                            <Image
                                source={require('@/assets/img/bianco.png')}
                                className="w-full h-80"
                                resizeMode="cover"
                            />
                        </View>

                        {/* CTA Card */}
                        <View className="bg-secondary rounded-3xl p-5">
                            <ThemedText className="text-xl font-bold mb-2">Home Renovations Simulator</ThemedText>
                            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mb-4">
                                Upload a photo of the room you want to renovate.
                            </ThemedText>
                            <Pressable  
                                onPress={() => setCurrentStep('style')}
                                className="bg-highlight py-4 rounded-full items-center"
                            >
                                <ThemedText className="text-white font-semibold text-lg">Try It!</ThemedText>
                            </Pressable>
                        </View>
                    </AnimatedView>
                </ScrollView>
            </View>
        );
    }

    // Step 1: Choose Style (moved from step 3)
    if (currentStep === 'style') {
        return (
            <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
                <StepHeader title="Step 1 / 4" />
                <ProgressBar />

                <ScrollView className="flex-1 px-global" contentContainerStyle={{ paddingBottom: 20 }}>
                    <ThemedText className="text-2xl font-bold mb-2">Select Style</ThemedText>
                    <ThemedText className="text-light-subtext dark:text-dark-subtext mb-6">
                        Select your desired design style to start creating your ideal interior
                    </ThemedText>

                    <View className="flex-row flex-wrap gap-3">
                        {DESIGN_STYLES.map((style) => (
                            <Pressable
                                key={style.id}
                                onPress={() => setSelectedStyle(style.id)}
                                className={`w-[48%] rounded-2xl overflow-hidden ${
                                    selectedStyle === style.id
                                        ? 'border-2 border-highlight'
                                        : 'border border-border'
                                }`}
                            >
                                <View className="h-28 bg-secondary items-center justify-center">
                                    <Icon name="Home" size={36} color={selectedStyle === style.id ? colors.highlight : colors.placeholder} />
                                </View>
                                <View className="p-3 bg-secondary/50">
                                    <ThemedText
                                        className={`font-semibold text-center ${
                                            selectedStyle === style.id ? 'text-highlight' : ''
                                        }`}
                                    >
                                        {style.label}
                                    </ThemedText>
                                    <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext text-center mt-1">
                                        {style.description}
                                    </ThemedText>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>

                <View className="px-global pb-8" style={{ paddingBottom: insets.bottom + 20 }}>
                    <Button
                        title="Continue"
                        variant={selectedStyle ? 'primary' : 'ghost'}
                        size="large"
                        disabled={!selectedStyle}
                        onPress={() => setCurrentStep('upload')}
                    />
                </View>
            </View>
        );
    }

    // Step 2: Upload Photo (moved from step 1)
    if (currentStep === 'upload') {
        return (
            <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
                <StepHeader title="Step 2 / 4" />
                <ProgressBar />

                <View className="flex-1 px-global">
                    <ThemedText className="text-2xl font-bold mb-6">Add a Photo</ThemedText>

                    <Pressable
                        onPress={pickImage}
                        className="flex-1 max-h-[500px] border-2 border-dashed border-border rounded-3xl items-center justify-center bg-secondary/30"
                    >
                        {image ? (
                            <View className="w-full h-full rounded-3xl overflow-hidden">
                                <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                                <Pressable
                                    onPress={() => setImage(null)}
                                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
                                >
                                    <Icon name="X" size={20} color="white" />
                                </Pressable>
                            </View>
                        ) : (
                            <View className="items-center">
                                <ThemedText className="text-xl font-bold mb-2">Start Redesigning</ThemedText>
                                <ThemedText className="text-light-subtext dark:text-dark-subtext mb-6">
                                    Redesign and beautify your room
                                </ThemedText>
                                <View className="bg-black px-6 py-3 rounded-full flex-row items-center gap-2">
                                    <ThemedText className="text-white font-semibold">Add a Photo</ThemedText>
                                    <Icon name="Plus" size={18} color="white" />
                                </View>
                            </View>
                        )}
                    </Pressable>
                </View>

                <View className="px-global pb-8" style={{ paddingBottom: insets.bottom + 20 }}>
                    <Button
                        title="Continue"
                        variant={image ? 'primary' : 'ghost'}
                        size="large"
                        disabled={!image}
                        onPress={() => setCurrentStep('details')}
                    />
                </View>
            </View>
        );
    }

    // Step 3: Add Details (new step with form)
    if (currentStep === 'details') {
        const isFormComplete = roomArea && wallStyle && furniture;
        
        return (
            <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
                <StepHeader title="Step 3 / 4" />
                <ProgressBar />

                <ScrollView className="flex-1 px-global" contentContainerStyle={{ paddingBottom: 20 }}>
                    <ThemedText className="text-2xl font-bold mb-2">Add Details</ThemedText>
                    <ThemedText className="text-light-subtext dark:text-dark-subtext mb-6">
                        Customize your renovation preferences
                    </ThemedText>

                    <Dropdown
                        label="Room Area (m²)"
                        value={roomArea}
                        options={ROOM_AREAS}
                        onSelect={setRoomArea}
                        placeholder="Select room area"
                    />

                    <Dropdown
                        label="Wall Style"
                        value={wallStyle}
                        options={WALL_STYLES}
                        onSelect={setWallStyle}
                        placeholder="Select wall style"
                    />

                    <Dropdown
                        label="Furniture"
                        value={furniture}
                        options={FURNITURE_OPTIONS}
                        onSelect={setFurniture}
                        placeholder="Select furniture style"
                    />

                    <Dropdown
                        label="Preferences"
                        value={preferences}
                        options={PREFERENCES_OPTIONS}
                        onSelect={setPreferences}
                        placeholder="Select preference"
                    />

                    {error && (
                        <View className="mt-4 bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                            <ThemedText className="text-red-500 text-sm">{error}</ThemedText>
                        </View>
                    )}
                </ScrollView>

                <View className="px-global pb-8" style={{ paddingBottom: insets.bottom + 20 }}>
                    <Button
                        title="Generate Design"
                        variant={isFormComplete ? 'primary' : 'ghost'}
                        size="large"
                        disabled={!isFormComplete}
                        onPress={handleGenerate}
                    />
                </View>
            </View>
        );
    }

    // Processing Screen
    if (currentStep === 'processing') {
        return (
            <View className="flex-1 bg-background items-center justify-center" style={{ paddingTop: insets.top }}>
                <View className="items-center">
                    <View className="w-40 h-40 rounded-3xl overflow-hidden mb-6">
                        <Image
                            source={require('@/assets/img/bianco.png')}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <ActivityIndicator size="large" color={colors.highlight} className="mb-4" />
                    <ThemedText className="text-2xl font-semibold mb-2">Processing...</ThemedText>
                    <ThemedText className="text-highlight font-medium">bianco.ai</ThemedText>
                </View>

                <View className="absolute bottom-20 px-global">
                    <ThemedText className="text-center text-light-subtext dark:text-dark-subtext">
                        Please don't close the app or lock your device
                    </ThemedText>
                </View>
            </View>
        );
    }

    // Result Screen
    if (currentStep === 'result') {
        return (
            <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
                <View className="flex-row items-center justify-between px-global py-4">
                    <ThemedText className="text-xl font-bold">Your Redesigned Room</ThemedText>
                    <Pressable onPress={resetFlow}>
                        <Icon name="X" size={24} color={colors.text} />
                    </Pressable>
                </View>

                <ScrollView className="flex-1 px-global">
                    <AnimatedView animation="fadeInUp">
                        {/* Before */}
                        <View className="mb-4">
                            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mb-2">Before</ThemedText>
                            <View className="h-48 rounded-2xl overflow-hidden border border-border">
                                <Image source={{ uri: image! }} className="w-full h-full" resizeMode="cover" />
                            </View>
                        </View>

                        {/* After */}
                        <View className="mb-6">
                            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mb-2">After - {DESIGN_STYLES.find(s => s.id === selectedStyle)?.label}</ThemedText>
                            <View className="h-80 rounded-2xl overflow-hidden border border-border bg-secondary">
                                {resultImage && (
                                    <Image source={{ uri: resultImage }} className="w-full h-full" resizeMode="cover" />
                                )}
                            </View>
                        </View>

                        <View className="flex-row gap-3 mb-8">
                            <Button
                                title="Try Another Style"
                                variant="ghost"
                                className="flex-1"
                                onPress={() => setCurrentStep('style')}
                            />
                            <Button
                                title="Start Over"
                                variant="primary"
                                className="flex-1"
                                onPress={resetFlow}
                            />
                        </View>
                    </AnimatedView>
                </ScrollView>
            </View>
        );
    }

    return null;
}
