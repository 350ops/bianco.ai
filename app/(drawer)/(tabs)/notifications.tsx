import Header from "@/components/Header";
import Section from "@/components/layout/Section";
import ThemedScroller from "@/components/ThemeScroller";
import AnimatedView from "@/components/AnimatedView";
import { Image, Pressable, View } from "react-native";
import ThemedText from "@/components/ThemedText";
import { Link } from "expo-router";

const activities = [
    { id: '1', title: 'Colorful Abstract Background', status: '2 remixes', image: require('@/assets/img/scify-1.jpg') },
    { id: '2', title: 'Female Artist Portrait', status: '2 remixes', image: require('@/assets/img/user-1.jpg') },
    { id: '3', title: 'Cook and Artist Portraits', status: '2 remixes', image: require('@/assets/img/user-2.jpg') },
    { id: '4', title: 'Alien Planet at Night', status: '2 images', image: require('@/assets/img/scify-2.jpg') },
    { id: '5', title: 'Purple Glassy Icon', status: '2 images', image: require('@/assets/img/scify-3.jpg') },
    { id: '6', title: 'Purple Silk Texture', status: '2 remixes', image: require('@/assets/img/scify-4.jpg') },
    { id: '7', title: 'Image Generation', status: 'Guideline violation · Review', image: require('@/assets/img/scify-5.jpg') },
    { id: '8', title: '3D Logo on Transparency', status: '2 remixes', image: require('@/assets/img/thomino.jpg') },
    { id: '9', title: 'Glowing Gold Letters', status: '2 remixes', image: require('@/assets/img/scify-1.jpg') },
    { id: '10', title: 'Developer Meditation Pose', status: '2 remixes', image: require('@/assets/img/user-3.jpg') },
    { id: '11', title: 'Yoga Teacher Portrait', status: '2 images', image: require('@/assets/img/user-4.jpg') },
];

export default function NotificationsScreen() {
    return (
        <>
            <Header className='pt-10' />
            <AnimatedView
                animation="scaleIn"
                className='flex-1 bg-background'
                duration={300}
            >
                <ThemedScroller className="flex-1 bg-background !px-0">
                    <Section title="Activity" titleSize="4xl" className="px-global mt-10 mb-6" />
                    {activities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                </ThemedScroller>
            </AnimatedView>
        </>
    );
}

const ActivityItem = ({ activity }: { activity: any }) => {
    return (
        <Link href="/screens/post-detail" asChild>
            <Pressable className="flex-row items-center px-global py-4">
                <Image 
                    source={activity.image}
                    className="w-16 h-16 rounded-xl"
                    resizeMode="cover"
                />
                <View className="flex-1 ml-4">
                    <ThemedText className="text-lg font-semibold mb-1">
                        {activity.title}
                    </ThemedText>
                    <ThemedText className="text-sm opacity-60">
                        {activity.status}
                    </ThemedText>
                </View>
            </Pressable>
        </Link>
    );
}