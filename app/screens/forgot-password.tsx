import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import ThemedText from '@/components/ThemedText';

export default function ForgotPasswordScreen() {
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
                    Reset your password
                  </ThemedText>
                  <ThemedText className="mt-2 text-center text-sm opacity-50">
                    Enter your email to receive a reset link
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

                  <Button
                    title="Send Reset Link"
                    size="large"
                    className="mb-4 !bg-highlight"
                    rounded="full"
                    textClassName="!text-white"
                    href="/screens/login"
                  />

                  <Link className="text-center text-sm text-text underline" href="/screens/login">
                    Back to Login
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
