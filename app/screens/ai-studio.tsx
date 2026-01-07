import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useThemeColors from '../contexts/ThemeColors';

import AnimatedView from '@/components/AnimatedView';
import { Button } from '@/components/Button';
import { CardScroller } from '@/components/CardScroller';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';

// API Key from environment variable
// Set EXPO_PUBLIC_OPENAI_API_KEY in your .env file
const DEFAULT_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export default function AiStudioScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // OpenAI requires square images for edits
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResultImage(null); // Reset result when new image is picked
    }
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

  const handleGenerate = async () => {
    // Clear previous errors
    setErrorDetails(null);

    if (!apiKey) {
      Alert.alert('API Key Missing', 'Please enter your OpenAI API Key.');
      setShowApiKeyInput(true);
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

    setLoading(true);
    setResultImage(null);

    try {
      console.log('🚀 Starting image generation...');
      console.log('📍 Image URI:', image);
      console.log('📝 Prompt:', prompt);
      console.log('🔑 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');

      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'image.png',
        type: 'image/png',
      } as any);
      formData.append('prompt', prompt);
      formData.append('n', '1');
      formData.append('size', '1024x1024');
      // Use 'gpt-image-1' for the latest model, or 'dall-e-2' for legacy edits
      formData.append('model', 'gpt-image-1.5');

      console.log('📤 Sending request to OpenAI...');

      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      console.log('📥 Response status:', response.status);
      console.log(
        '📥 Response headers:',
        JSON.stringify(Object.fromEntries(response.headers.entries()))
      );

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText.substring(0, 500));

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        const errorMsg = `Failed to parse response. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`;
        setErrorDetails(errorMsg);
        Alert.alert('Parse Error', 'Failed to parse API response. Check the error details below.');
        return;
      }

      if (!response.ok || data.error) {
        const errorMessage = getErrorMessage(data.error, response.status);
        console.error('❌ OpenAI Error:', data.error);
        console.error('❌ Status:', response.status);

        const detailedError = `Status: ${response.status}\nType: ${data.error?.type || 'Unknown'}\nCode: ${data.error?.code || 'N/A'}\nMessage: ${data.error?.message || 'No message'}`;
        setErrorDetails(detailedError);

        Alert.alert('OpenAI Error', errorMessage);
      } else if (data.data && data.data.length > 0) {
        console.log('✅ Success! Image URL:', data.data[0].url?.substring(0, 50) + '...');
        // Handle both URL and base64 responses
        const imageData = data.data[0];
        if (imageData.url) {
          setResultImage(imageData.url);
        } else if (imageData.b64_json) {
          setResultImage(`data:image/png;base64,${imageData.b64_json}`);
        }
        setErrorDetails(null);
      } else {
        console.error('❌ Unexpected response structure:', data);
        setErrorDetails(`Unexpected response: ${JSON.stringify(data).substring(0, 300)}`);
        Alert.alert('Error', 'No image returned from API. Check error details below.');
      }
    } catch (error: any) {
      console.error('❌ Network/Fetch Error:', error);
      const errorMsg = `Network Error: ${error.message || 'Unknown error'}\n\nThis could be due to:\n- No internet connection\n- CORS issues (if testing on web)\n- Invalid image format`;
      setErrorDetails(errorMsg);
      Alert.alert('Network Error', 'Failed to connect to OpenAI API. Check error details below.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setImage(null);
    setPrompt('');
    setResultImage(null);
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title="AI Studio"
        showBackButton
        rightComponents={[
          <Icon
            key="settings"
            name="Settings"
            size={24}
            color={colors.icon}
            onPress={() => setShowApiKeyInput(!showApiKeyInput)}
          />,
        ]}
      />

      <View className="mb-6">
        <ThemedText className="mb-2 text-xl font-bold">1. Upload Image</ThemedText>
        <ThemedText className="text-light-subtext dark:text-dark-subtext mb-4 text-sm">
          Select a square image to edit.
        </ThemedText>

        {!image ? (
          <Pressable
            onPress={pickImage}
            className="aspect-square w-full items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary">
            <Icon name="ImagePlus" size={48} color={colors.placeholder} />
            <ThemedText className="text-light-subtext dark:text-dark-subtext mt-4 font-semibold">
              Tap to select image
            </ThemedText>
          </Pressable>
        ) : (
          <View className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
            <Image source={{ uri: image }} className="h-full w-full" resizeMode="cover" />
            <Pressable
              onPress={() => setImage(null)}
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2">
              <Icon name="X" size={20} color="white" />
            </Pressable>
          </View>
        )}
      </View>

      <View className="mb-6">
        <ThemedText className="mb-2 text-xl font-bold">2. Describe Changes</ThemedText>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="A futuristic city in the background..."
          placeholderTextColor={colors.placeholder}
          className="min-h-[100px] rounded-xl border border-border bg-secondary p-4 text-base text-text"
          multiline
          textAlignVertical="top"
        />
      </View>

      <Button
        title={loading ? 'Generating...' : 'Generate with GPT Image'}
        onPress={handleGenerate}
        variant="primary"
        size="large"
        disabled={loading || !image || !prompt}
      />

      {loading && (
        <View className="mt-8 items-center">
          <ActivityIndicator size="large" color={colors.highlight} />
          <ThemedText className="mt-4 animate-pulse font-semibold">Processing image...</ThemedText>
        </View>
      )}

      {errorDetails && (
        <AnimatedView
          animation="fadeInUp"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <ThemedText className="font-bold text-red-500">Error Details</ThemedText>
            <Pressable onPress={() => setErrorDetails(null)}>
              <Icon name="X" size={18} color="#ef4444" />
            </Pressable>
          </View>
          <ThemedText className="font-mono text-sm text-red-400">{errorDetails}</ThemedText>
          <ThemedText className="text-light-subtext dark:text-dark-subtext mt-3 text-xs">
            💡 Check the console logs for more details
          </ThemedText>
        </AnimatedView>
      )}

      {resultImage && (
        <AnimatedView animation="fadeInUp" className="mb-8 mt-8">
          <ThemedText className="mb-4 text-xl font-bold">Result</ThemedText>
          <View className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl border border-border bg-secondary">
            <Image source={{ uri: resultImage }} className="h-full w-full" resizeMode="cover" />
          </View>
          <View className="flex-row gap-4">
            <Button
              title="Discard"
              variant="ghost"
              className="flex-1"
              onPress={() => setResultImage(null)}
            />
            <Button
              title="Save / Use"
              variant="primary"
              className="flex-1"
              onPress={() => {
                // Here you would implement saving logic or navigation
                Alert.alert('Saved!', 'Image functionality to be implemented.');
              }}
            />
          </View>
        </AnimatedView>
      )}
    </View>
  );
}
