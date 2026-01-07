import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import { Pressable, View, Text } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';

import ActionSheetThemed from './ActionSheetThemed';
import { Button } from './Button';
import Icon from './Icon';
import ThemedText from './ThemedText';

import { useThemeColors } from '@/app/contexts/ThemeColors';

interface FavoriteProps {
  initialState?: boolean;
  size?: number;
  className?: string;
  productName?: string;
  isWhite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

const Favorite: React.FC<FavoriteProps> = ({
  initialState = false,
  size = 22,
  className = '',
  productName = 'Product',
  onToggle,
  isWhite = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialState);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const colors = useThemeColors();

  const handleToggle = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    actionSheetRef.current?.show();

    if (onToggle) {
      onToggle(newState);
    }
  };

  const handleViewFavorites = () => {
    actionSheetRef.current?.hide();
    // Navigate to favorites screen
    router.push('/(drawer)/(tabs)/favorites');
  };

  return (
    <>
      <Pressable onPress={handleToggle} className={className}>
        {isWhite ? (
          <Icon
            name="Heart"
            size={size}
            fill={isFavorite ? 'white' : 'none'}
            color={isFavorite ? 'white' : 'white'}
            strokeWidth={1.8}
          />
        ) : (
          <Icon
            name="Heart"
            size={size}
            fill={isFavorite ? 'red' : 'none'}
            color={isFavorite ? 'red' : colors.icon}
            strokeWidth={1.8}
          />
        )}
      </Pressable>

      <ActionSheetThemed ref={actionSheetRef} gestureEnabled>
        <View className="p-4 pb-6">
          <ThemedText className="mb-1 mt-4 text-left text-lg font-bold">
            {isFavorite ? 'Added to Favorites' : 'Removed from Favorites'}
          </ThemedText>

          <ThemedText className="mb-6 text-left">
            {isFavorite
              ? `${productName} has been added to your favorites.`
              : `${productName} has been removed from your favorites.`}
          </ThemedText>

          <View className="w-full flex-row justify-center">
            {isFavorite && (
              <Button title="View Favorites" className="flex-1" onPress={handleViewFavorites} />
            )}

            <Button
              title="Continue Browsing"
              variant="outline"
              className={isFavorite ? 'ml-3 px-6' : 'px-6'}
              onPress={() => actionSheetRef.current?.hide()}
            />
          </View>
        </View>
      </ActionSheetThemed>
    </>
  );
};

// Support both named and default imports
export { Favorite };
export default Favorite;
