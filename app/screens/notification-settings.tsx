import { View } from "react-native";
import Header from "@/components/Header";
import ThemedScroller from "@/components/ThemeScroller";
import Section from "@/components/layout/Section";
import Switch from "@/components/forms/Switch";
import { useState } from "react";

export default function NotificationSettingsScreen() {
    const [generationComplete, setGenerationComplete] = useState(true);

    return (
        <>
            <Header showBackButton />
            <ThemedScroller className="p-global">

                <Section title="Notification Settings" titleSize="4xl" className="mt-4 mb-10" />
                <View className="rounded-2xl overflow-hidden">
                    <Switch 
                        label="Generation complete" 
                        description="When your AI image generation is ready" 
                        icon="Sparkles" 
                        value={generationComplete} 
                        onChange={setGenerationComplete}
                        className="!border-b-0"
                    />
                </View>
            </ThemedScroller>
        </>
    )
}

