import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Link, Stack } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        animation: 'none',
      }} />
      <View className='flex-1 bg-black'>
        <LinearGradient colors={['rgba(255,32,56,0.1)', '#000']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            className="flex-1">
            <StatusBar style='light' />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              className='flex-1 justify-center w-full'
            >
              <View className=' w-full flex-1'>
                <View className=' py-14 justify-center px-10' style={{ paddingTop: insets.top + 100 }}>
                  <ThemedText className="text-4xl text-center font-outfit-bold">Reset your password</ThemedText>
                  <ThemedText className="text-sm text-center opacity-50 mt-2">Enter your email to receive a reset link</ThemedText>
                </View>
                <View className='p-global gap-4'>
                  <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholder="Email"
                    placeholderTextColor="white"
                    className="text-white bg-white/20 rounded-full px-5 py-5"
                  />

                  <Button
                    title="Send Reset Link"
                    size="large"
                    className="mb-4 !bg-highlight"
                    rounded="full"
                    textClassName='!text-white'
                    href="/screens/login"
                  />

                  <Link className='underline text-center text-text text-sm' href="/screens/login">
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