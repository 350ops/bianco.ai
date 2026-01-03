import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Expandable from '@/components/Expandable';
import Section from '@/components/layout/Section';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import AnimatedView from '@/components/AnimatedView';

// FAQ data
const faqData = [
  {
    id: '1',
    question: 'How do I generate an image?',
    answer: 'Tap the "+" button and describe what you want to create using text. Our AI will generate multiple variations for you. Choose your favorite, refine it, and share it with the community.'
  },
  {
    id: '2',
    question: 'What makes a good prompt?',
    answer: 'Be specific and descriptive! Include details about style, lighting, mood, and composition. For example: "A serene mountain landscape at sunset, oil painting style, warm colors".'
  },
  {
    id: '3',
    question: 'How do I remix someone else\'s creation?',
    answer: 'Tap any image you like and select "Remix". You can modify the original prompt, adjust parameters, or use it as a reference for your own variation. All remixes credit the original creator.'
  },
  {
    id: '4',
    question: 'Can I make my generations private?',
    answer: 'Yes! When generating, toggle "Private" to keep it in your media library only. You can also make your entire account private in Settings > Security & Privacy.'
  },
  {
    id: '5',
    question: 'How do I report inappropriate content?',
    answer: 'Tap the three dots on any image or profile and select "Report". Choose the reason and we\'ll review it. You can also block users to prevent them from viewing your content.'
  },
  {
    id: '6',
    question: 'What happens to my generated images?',
    answer: 'All your generations are saved in "My Media" and organized by date. You own the images you create and can download them anytime. Shared images remain in your profile.'
  },
  {
    id: '7',
    question: 'How do generation credits work?',
    answer: 'Free accounts get daily generation credits. Subscribe to get unlimited generations, faster processing, and access to advanced features like video generation.'
  },
  {
    id: '8',
    question: 'Can I edit or delete my generations?',
    answer: 'Yes! Open any generation from your media library and tap "Edit" to adjust or "Delete" to remove it. You can also add effects, filters, or variations to existing images.'
  }
];

// Contact information
const contactInfo = [
  {
    id: 'email',
    type: 'Email Support',
    value: 'support@picaso.ai',
    icon: 'Mail' as const,
    action: () => Linking.openURL('mailto:support@picaso.ai')
  },
  {
    id: 'community',
    type: 'Community Discord',
    value: 'Join our creator community',
    icon: 'MessageCircle' as const,
    action: () => Linking.openURL('https://discord.gg/picaso')
  },
  {
    id: 'hours',
    type: 'Support Hours',
    value: '24/7 AI-Powered Help',
    icon: 'Clock' as const,
    action: undefined
  }
];

export default function HelpScreen() {
  return (
    <View className="flex-1 bg-background dark:bg-dark-primary">
      <Header title="Help & Support" showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <AnimatedView animation="fadeIn" duration={400}>
          {/* FAQ Section */}
          <Section 
            title="Frequently Asked Questions" 
            titleSize="xl" 
            className="px-global pt-6 pb-2"
          />
          
          <View className="px-global">
            {faqData.map((faq) => (
              <Expandable 
                key={faq.id}
                title={faq.question}
                className="py-1"
              >
                <ThemedText className="text-light-text dark:text-dark-text leading-6">
                  {faq.answer}
                </ThemedText>
              </Expandable>
            ))}
          </View>
          

          
          {/* Contact Section */}
          <Section 
            title="Contact Us" 
            titleSize="xl" 
            className="px-global pb-2 mt-14"
            subtitle="We're here to help with any questions or concerns"
          />
          
          <View className="px-global pb-8">
            {contactInfo.map((contact) => (
              <TouchableOpacity 
                key={contact.id}
                onPress={contact.action}
                disabled={!contact.action}
                className="flex-row items-center py-4 border-b border-border"
              >
                <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center mr-4">
                  <Icon name={contact.icon} size={20} />
                </View>
                <View>
                  <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                    {contact.type}
                  </ThemedText>
                  <ThemedText className="font-medium">
                    {contact.value}
                  </ThemedText>
                </View>
                {contact.action && (
                  <Icon name="ChevronRight" size={20} className="ml-auto text-light-subtext dark:text-dark-subtext" />
                )}
              </TouchableOpacity>
            ))}
            
            <Button 
              title="Contact Support" 
              iconStart="Mail"
              className="mt-8"
              onPress={() => Linking.openURL('mailto:support@picaso.ai')}
            />
          </View>
        </AnimatedView>
      </ScrollView>
    </View>
  );
}
