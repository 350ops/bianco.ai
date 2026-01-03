import { View } from "react-native";
import Header from "@/components/Header";
import ThemedScroller from "@/components/ThemeScroller";
import Section from "@/components/layout/Section";
import Switch from "@/components/forms/Switch";
import { useState } from "react";

export default function NotificationSettingsScreen() {
    const [transactionAlerts, setTransactionAlerts] = useState(true);
    const [paymentReceived, setPaymentReceived] = useState(true);
    const [lowBalance, setLowBalance] = useState(true);
    const [securityAlerts, setSecurityAlerts] = useState(true);
    const [monthlyStatement, setMonthlyStatement] = useState(false);
    const [promotions, setPromotions] = useState(false);

    return (
        <>
            <Header showBackButton />
            <ThemedScroller className="p-global">

                <Section title="Notification Settings" titleSize="4xl" className="mt-4 mb-10" />
                <View className="bg-secondary rounded-2xl overflow-hidden">
                    <Switch label="Generation complete" description="When your AI image generation is ready" icon="Sparkles" value={transactionAlerts} onChange={setTransactionAlerts} />
                    <Switch label="Likes & reactions" description="When someone likes your shared images" icon="Heart" value={paymentReceived} onChange={setPaymentReceived} />
                    <Switch label="Comments" description="New comments on your generated images" icon="MessageCircle" value={lowBalance} onChange={setLowBalance} />
                    <Switch label="Remixes & variations" description="When someone remixes your creation" icon="RefreshCw" value={securityAlerts} onChange={setSecurityAlerts} />
                    <Switch label="New followers" description="Get notified when someone follows you" icon="UserPlus" value={monthlyStatement} onChange={setMonthlyStatement} />
                    <Switch label="Generation trends" description="Weekly trending prompts and styles" icon="TrendingUp" value={promotions} onChange={setPromotions} />
                </View>
            </ThemedScroller>
        </>
    )
}

