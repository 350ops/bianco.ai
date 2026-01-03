import Header from "@/components/Header";
import ThemedScroller from "@/components/ThemeScroller";
import Section from "@/components/layout/Section";
import Switch from "@/components/forms/Switch";
import React, { useRef, useState } from "react";
import Expandable from "@/components/Expandable";
import Input from "@/components/forms/Input";
import ListLink from "@/components/ListLink";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ImageBackground, Pressable, Text, View } from "react-native";
import Avatar from "@/components/Avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { Link } from "expo-router";

export default function CardControlsScreen() {
    const [verification, setVerification] = useState(true);
    const [locationTracking, setLocationTracking] = useState(true);
    const logoutDrawerRef = useRef<ActionSheetRef>(null);
    return (
        <>
            <Header leftComponent={<Avatar src={require('@/assets/img/thomino.jpg')} size="sm" />}
                rightComponents={[
                    <ThemeToggle />
                ]}
            />
            <ThemedScroller>
                <Section title="Profile Settings" titleSize="4xl" className="mt-10 mb-10" />
                <SubscribeCard />
                <Section title="Settings" titleSize="lg" className=" mt-10 mb-4">
                    <View className="bg-secondary rounded-2xl overflow-hidden">
                        <ListLink title="Notifications" description='Customize how you get updates' showChevron icon="Bell" href="/screens/notification-settings" />
                        <ListLink title="Help" description='Get help with your account' showChevron icon="HelpCircle" href="/screens/help" />
                        <ListLink title="Profile" description='Manage your profile' showChevron icon="Settings" href="/screens/edit-profile" />


                        <ListLink title="Language" description='Change your language' showChevron icon="Globe" href="/screens/languages" />
                        <ListLink title="Logout" className="!border-b-0" description='Logout of your account' icon="LogOut" href="/screens/welcome" />
                    </View>
                </Section>
                <Section title="Security" titleSize="lg" className="mt-10 mb-4">
                    <View className="bg-secondary rounded-2xl overflow-hidden">
                        <Expandable title="Passcode" description="Enable a passcode to secure your account" icon="KeyRound">
                            <Input placeholder="Password" secureTextEntry />
                            <Input placeholder="Repeat password" secureTextEntry />
                        </Expandable>
                        <Expandable title="2-step verification" className="!border-b-0" description="Status: On" icon="Fingerprint">
                            <Switch className="mb-6" label="Enable" description="Second layer of security" value={verification} onChange={setVerification} />
                        </Expandable>
                    </View>
                </Section>



                <Section title="Privacy" titleSize="lg" className="mt-10 mb-4">
                    <View className="bg-secondary rounded-2xl overflow-hidden">
                        <Switch icon="Users" label="Sync your contacts" description="Find friends from your contacts" value={verification} onChange={setVerification} />
                        <Switch icon="Globe" label="Location sharing" description="Share your location in posts" value={locationTracking} onChange={setLocationTracking} />
                        <Switch icon="Eye" label="Private account" description="Only followers can see your posts" value={verification} onChange={setVerification} />
                        <Switch icon="MessageCircle" label="Read receipts" className="!border-b-0" description="Let others know when you've read their messages" value={locationTracking} onChange={setLocationTracking} />
                    </View>
                </Section>


            </ThemedScroller>
        </>
    )
}


const SubscribeCard = () => {
    return (
        <Link asChild href="/screens/subscription">
            <Pressable className='bg-rose-500 flex flex-row rounded-3xl mb-4 overflow-hidden'>
                <ImageBackground source={require('@/assets/img/subscribe.jpg')} className='w-full h-full pl-8 min-h-[180px] flex-row items-center'>
                    <View className='pr-6 w-2/3'>
                        <Text className='text-2xl font-outfit-bold text-white'>Picaso +</Text>
                        <Text className='text-base  text-white'>Unleash your creativity with premium features.</Text>
                        <View className="px-3 py-2 bg-white rounded-lg mr-auto mt-3">
                            <Text className="text-black text-sm">Upgrade to Plus</Text>
                        </View>
                    </View>
                </ImageBackground>
            </Pressable>
        </Link>
    );
}


