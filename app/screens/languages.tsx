import { US, ES, PT, FR, DE, IT, SA, TR } from 'country-flag-icons/string/3x2';
import { useState } from 'react';
import { Button, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import AnimatedView from '@/components/AnimatedView';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Section from '@/components/layout/Section';

interface Language {
  title: string;
  code: string;
  flag: string;
}

export default function LanguagesScreen() {
  const languages: Language[] = [
    { title: 'English', code: 'EN', flag: US },
    { title: 'Spanish', code: 'ES', flag: ES },
    { title: 'Portuguese', code: 'PT', flag: PT },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <>
      <Header showBackButton />
      <ThemedScroller className="p-global">
        <Section title="Choose Language" titleSize="4xl" className="mb-10 mt-4" />
        <View className="overflow-hidden rounded-2xl">
          {languages.map((language, index) => (
            <LanguageItem
              key={index}
              title={language.title}
              code={language.code}
              flag={language.flag}
              selected={selectedLanguage === language.title}
              onSelect={() => {
                setSelectedLanguage(language.title);
              }}
            />
          ))}
        </View>
      </ThemedScroller>
    </>
  );
}

interface LanguageItemProps {
  title: string;
  code: string;
  flag: string;
  selected: boolean;
  onSelect: () => void;
}

const LanguageItem = ({ title, code, flag, selected, onSelect }: LanguageItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      className={`flex-row items-center border-b border-border px-6 py-4 ${selected ? 'opacity-100' : 'opacity-100 '}`}>
      <View className="mr-6 h-7 w-7 overflow-hidden rounded">
        <SvgXml xml={flag} width={28} height={28} />
      </View>
      <View className="flex-1">
        <ThemedText className="text-lg font-bold">{title}</ThemedText>
        <ThemedText className="text-sm opacity-60">{code}</ThemedText>
      </View>
      {selected && (
        <AnimatedView animation="bounceIn" duration={500}>
          <Icon name="Check" size={16} className="h-7 w-7 rounded-full bg-highlight" />
        </AnimatedView>
      )}
    </TouchableOpacity>
  );
};
