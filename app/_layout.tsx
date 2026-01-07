import '../global.css';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Suppress known warnings from third-party libraries
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated', // react-native-actions-sheet uses deprecated SafeAreaView
]);

// Inner component that can access theme context
function AppContent() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="screens/welcome">
      {/* Auth screens */}
      <Stack.Screen name="screens/welcome" />
      <Stack.Screen name="screens/login" />
      <Stack.Screen name="screens/signup" />
      <Stack.Screen name="screens/forgot-password" />

      {/* Onboarding */}
      <Stack.Screen name="screens/onboarding-start" />
      <Stack.Screen name="screens/renovation-survey" />

      {/* Main app tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Other screens */}
      <Stack.Screen name="screens/settings" />
      <Stack.Screen name="screens/edit-profile" />
      <Stack.Screen name="screens/notification-settings" />
      <Stack.Screen name="screens/security" />
      <Stack.Screen name="screens/help" />
      <Stack.Screen name="screens/languages" />
      <Stack.Screen name="screens/subscription" />
      <Stack.Screen name="screens/lighting-tips" />
      <Stack.Screen name="screens/wide-angle-tips" />
      <Stack.Screen name="screens/clear-space-tips" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      className={`flex-1 bg-background ${Platform.OS === 'ios' ? 'pb-0' : ''}`}
      style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
