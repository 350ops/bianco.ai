import Header from "@/components/Header";
import ThemedScroller from "@/components/ThemeScroller";
import Section from "@/components/layout/Section";
import Switch from "@/components/forms/Switch";
import React, { useRef, useState } from "react";
import Expandable from "@/components/Expandable";
import Input from "@/components/forms/Input";
import ListLink from "@/components/ListLink";
import { ActionSheetRef } from "react-native-actions-sheet";
import ActionSheetThemed from "@/components/ActionSheetThemed";
import { View } from "react-native";
import ThemedText from "@/components/ThemedText";
import { Button } from "@/components/Button";

export default function CardControlsScreen() {
    const [verification, setVerification] = useState(true);
    const [locationTracking, setLocationTracking] = useState(true);
    const logoutDrawerRef = useRef<ActionSheetRef>(null);
    return (
        <>
            <Header showBackButton />
            <ThemedScroller>
                <Section title="Security and privacy" titleSize="4xl" className="mt-4 mb-10" />
                <Section title="Security" titleSize="2xl" className="mt-10 mb-4">
                    <Expandable title="Passcode" description="Enable a passcode to secure your account" icon="KeyRound">
                        <Input placeholder="Password" secureTextEntry />
                        <Input placeholder="Repeat password" secureTextEntry />
                    </Expandable>
                    <Expandable title="2-step verification" description="Status: On" icon="Fingerprint">
                        <Switch className="mb-6" label="Enable" description="Second layer of security" value={verification} onChange={setVerification} />
                    </Expandable>
                    <ListLink title="Logout" onPress={() => { logoutDrawerRef.current?.show() }} description="Logout of your account" icon="LogOut" />
                </Section>

                <Section title="Privacy" titleSize="2xl" className="mt-10 mb-4">
                    <Switch icon="Users" className="border-b border-border pb-6 mt-3" label="Sync your contacts" description="Find friends from your contacts" value={verification} onChange={setVerification} />
                    <Switch icon="Globe" className="border-b border-border pb-6 mt-3" label="Location sharing" description="Share your location in posts" value={locationTracking} onChange={setLocationTracking} />
                    <Switch icon="Eye" className="border-b border-border pb-6 mt-3" label="Private account" description="Only followers can see your posts" value={verification} onChange={setVerification} />
                    <Switch icon="MessageCircle" className="mb-6 pb-6 mt-3" label="Read receipts" description="Let others know when you've read their messages" value={locationTracking} onChange={setLocationTracking} />
                </Section>


            </ThemedScroller>
            <LogoutDrawer ref={logoutDrawerRef} />
        </>
    )
}


const LogoutDrawer = React.forwardRef<ActionSheetRef>((props, ref) => {
    return (
        <ActionSheetThemed
            gestureEnabled
            ref={ref}>
            <View className='p-global pt-10 items-center'>
                <ThemedText className='text-3xl font-bold'>Logout?</ThemedText>
                <ThemedText className='text-base text-center mb-4'>Are you sure you want to logout of your account?</ThemedText>
                <View className="flex-row items-center justify-center gap-2 mt-14">
                    <Button title="Cancel" className="flex-1" variant="outline" rounded="full" />
                    <Button title="Logout" className="flex-1" rounded="full" />
                </View>
            </View>
        </ActionSheetThemed>
    );
});
