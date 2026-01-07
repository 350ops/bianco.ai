import React from 'react';
import { View } from 'react-native';

import ThemedText from '@/components/ThemedText';

export function renderItem(opts?: { rounded?: boolean }) {
  const roundedClass = opts?.rounded ? 'rounded-2xl' : 'rounded-none';

  return ({ item, index }: { item: string; index: number }) => {
    return (
      <View
        className={`flex-1 border border-border ${roundedClass} items-center justify-center`}
        style={{ backgroundColor: item }}>
        <ThemedText className="text-xl font-bold">{index + 1}</ThemedText>
      </View>
    );
  };
}
