import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, View, Text } from 'react-native';

export const CardPreview = (props: {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  brand?: string;
  onSetDefault: () => void;
  onDelete: () => void;
}) => {
  const { width } = Dimensions.get('window');
  return (
    <View
      style={{ height: width * 0.4, width: width * 0.7 }}
      className={` flex flex-col justify-end rounded-3xl ${props.brand === 'Visa' ? 'bg-lime-300' : 'bg-sky-300'}`}>
      <LinearGradient
        style={{ height: '100%', borderRadius: 15, justifyContent: 'flex-end' }}
        colors={[
          props.brand === 'Visa' ? '#BBF451' : '#74D4FF',
          props.brand === 'Mastercard' ? '#9DE1FF' : '#C0FF97',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View className="p-4">
          <View className="flex-row justify-between">
            {props.cardNumber && (
              <Text className="font-mono text-base font-bold">•••• {props.cardNumber}</Text>
            )}
            <Text className="font-mono text-base font-bold">{props.expiryDate}</Text>
          </View>
        </View>

        <View className="absolute left-0 top-0 w-full flex-row justify-between p-4">
          <Text className="text-base font-bold">{props.brand}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};
