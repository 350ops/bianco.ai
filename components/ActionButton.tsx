import { Pressable, View } from 'react-native';

import Icon from './Icon';
import ThemedText from './ThemedText';

export const ActionButton = (props: { icon: any; label?: string; onPress?: () => void }) => {
  return (
    <Pressable
      className="flex min-w-[70px] flex-col items-center justify-center"
      onPress={props.onPress}>
      <View className="h-16 w-16 items-center justify-center rounded-full bg-highlight">
        <Icon name={props.icon} size={24} color="black" />
      </View>
      {props.label && (
        <ThemedText className="mt-2 text-center text-sm font-semibold">{props.label}</ThemedText>
      )}
    </Pressable>
  );
};
