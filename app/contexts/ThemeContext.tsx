import { StatusBar } from 'expo-status-bar';
import { colorScheme } from 'nativewind';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { View, useColorScheme, Appearance } from 'react-native';

import { themes } from '@/utils/color-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Color palette for programmatic use
const colorPalettes = {
  light: {
    primary: '#ffffff',
    invert: '#000000',
    secondary: '#007334',
    background: '#ffffff',
    darker: '#B8A182',
    text: '#5D3A1E',
    textSecondary: '#75523C',
    highlight: '#9B744D',
    border: '#9B744D',
    card: '#B8A182',
    success: '#9B744D',
    error: '#9B744D',
    warning: '#B8A182',
    info: '#9B744D',
    green: '#50A673',
  },
  dark: {
    primary: '#ffffff',
    invert: '#000000',
    secondary: '#262626',
    background: '#0B0B0D',
    darker: '#000000',
    text: '#ffffff',
    textSecondary: '#9CA3AF',
    highlight: '#FF2056',
    border: 'rgba(255, 255, 255, 0.15)',
    card: '#1C1C1E',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    green: '#50A673',
  },
};

export type ThemeColors = typeof colorPalettes.light;

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: ThemeColors;
  isSystemTheme: boolean;
  setSystemTheme: (useSystem: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: colorPalettes.light,
  isSystemTheme: true,
  setSystemTheme: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get the device's current color scheme
  const deviceColorScheme = useColorScheme();
  
  // Track whether we're following system theme (default: true)
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  
  // Manual theme override (only used when isSystemTheme is false)
  const [manualTheme, setManualTheme] = useState<'light' | 'dark'>('light');

  // Determine the current theme based on system or manual preference
  const currentTheme: 'light' | 'dark' = isSystemTheme 
    ? (deviceColorScheme === 'dark' ? 'dark' : 'light')
    : manualTheme;

  // Sync nativewind color scheme with current theme
  useEffect(() => {
    colorScheme.set(currentTheme);
  }, [currentTheme]);

  // Listen to system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (isSystemTheme) {
        colorScheme.set(newColorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription.remove();
  }, [isSystemTheme]);

  const toggleTheme = () => {
    if (isSystemTheme) {
      // If currently following system, switch to manual mode with opposite theme
      setIsSystemTheme(false);
      setManualTheme(currentTheme === 'light' ? 'dark' : 'light');
    } else {
      // Toggle manual theme
      setManualTheme(manualTheme === 'light' ? 'dark' : 'light');
    }
  };

  const setSystemTheme = (useSystem: boolean) => {
    setIsSystemTheme(useSystem);
    if (useSystem && deviceColorScheme) {
      colorScheme.set(deviceColorScheme);
    }
  };

  const colors = useMemo(() => colorPalettes[currentTheme], [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, colors, isSystemTheme, setSystemTheme }}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        style={currentTheme === 'dark' ? 'light' : 'dark'}
      />
      <View style={themes[currentTheme]} className="flex-1 bg-background">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Default export for the ThemeProvider
export default ThemeProvider;
