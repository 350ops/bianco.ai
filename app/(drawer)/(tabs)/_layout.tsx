import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import React from 'react';
import { View } from 'react-native';

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      {/* Tab bar hidden but screens still registered */}
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="index" href="/">
          <View />
        </TabTrigger>
        <TabTrigger name="archive" href="/archive">
          <View />
        </TabTrigger>
        <TabTrigger name="notifications" href="/notifications">
          <View />
        </TabTrigger>
        <TabTrigger name="profile" href="/profile">
          <View />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
