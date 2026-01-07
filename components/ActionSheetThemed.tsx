import React, { forwardRef } from 'react';
import { View, ViewStyle } from 'react-native';
import ActionSheet, { ActionSheetProps, ActionSheetRef } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useThemeColors from '@/app/contexts/ThemeColors';

interface ActionSheetThemedProps extends ActionSheetProps {}

const ActionSheetThemed = forwardRef<ActionSheetRef, ActionSheetThemedProps>(
  ({ containerStyle, ...props }, ref) => {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    return (
      <View className="absolute bottom-0 left-0 right-0 top-0 h-full w-full flex-1">
        <ActionSheet
          {...props}
          ref={ref}
          // Disable deprecated SafeAreaView
          safeAreaInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
          drawUnderStatusBar={false}
          containerStyle={{
            backgroundColor: colors.secondary,
            paddingTop: 5,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: insets.bottom,
            ...(containerStyle as any),
          }}
        />
      </View>
    );
  }
);

// Add displayName for forwardRef component
ActionSheetThemed.displayName = 'ActionSheetThemed';

// Support both named and default imports
export { ActionSheetThemed };
export default ActionSheetThemed;
