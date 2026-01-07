import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  View,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import ThemedText from '@/components/ThemedText';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <View className="flex-1 bg-black">
        <LinearGradient colors={['rgba(255,32,56,0.1)', '#000']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            className="flex-1">
            <StatusBar style="light" />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              className="w-full flex-1 justify-center">
              <View className=" w-full flex-1">
                <View
                  className=" justify-center px-10 py-14"
                  style={{ paddingTop: insets.top + 100 }}>
                  <ThemedText className="text-center font-outfit-bold text-4xl">
                    Create your account
                  </ThemedText>
                  <ThemedText className="mt-2 text-center text-sm opacity-50">
                    Sign up to get started
                  </ThemedText>
                </View>
                <View className="gap-4 p-global">
                  <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholder="Email"
                    placeholderTextColor="white"
                    className="rounded-full bg-white/20 px-5 py-5 text-white"
                  />

                  <TextInput
                    keyboardType="default"
                    autoCapitalize="none"
                    autoComplete="password"
                    placeholder="Password"
                    placeholderTextColor="white"
                    secureTextEntry
                    className="rounded-full bg-white/20 px-5 py-5 text-white"
                  />

                  <TextInput
                    keyboardType="default"
                    autoCapitalize="none"
                    autoComplete="password"
                    placeholder="Confirm Password"
                    placeholderTextColor="white"
                    secureTextEntry
                    className="rounded-full bg-white/20 px-5 py-5 text-white"
                  />

                  <Button
                    title="Sign up"
                    size="large"
                    className="mb-4 !bg-highlight"
                    rounded="full"
                    textClassName="!text-white"
                    href="/screens/onboarding-start"
                  />

                  <View className="flex flex-row items-center justify-center gap-2">
                    <Pressable
                      onPress={() => router.push('/screens/onboarding-start')}
                      className="flex flex-1 flex-row items-center justify-center rounded-full border border-white py-4">
                      <AntDesign name="google" size={22} color="white" />
                    </Pressable>

                    <Pressable
                      onPress={() => router.push('/screens/onboarding-start')}
                      className="flex flex-1 flex-row items-center justify-center rounded-full border border-white py-4">
                      <AntDesign name="apple" size={22} color="white" />
                    </Pressable>
                  </View>

                  <Link
                    className="mt-4 text-center text-sm text-text underline"
                    href="/screens/login">
                    Already have an account? Login
                  </Link>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
}
