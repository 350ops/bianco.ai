import { View, Pressable, Image, Text, ScrollView } from "react-native";
import ThemedScroller from "@/components/ThemeScroller";
import ThemedText from "@/components/ThemedText";
import React, { useRef, useState } from "react";
import AnimatedView from "@/components/AnimatedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@/components/Icon";
import { Link } from "expo-router";
import ActionSheetThemed from "@/components/ActionSheetThemed";
import { ActionSheetRef } from "react-native-actions-sheet";
import Header, { HeaderIcon } from "@/components/Header";


const mediaData = [
    {
        date: 'Tue Nov 25',
        images: [
            { source: require('@/assets/img/scify-2.jpg'), isVideo: true },
            { source: require('@/assets/img/scify-3.jpg'), isVideo: false }
        ]
    },
    {
        date: 'Tue Nov 11',
        images: [
            { source: require('@/assets/img/scify-5.jpg'), isVideo: false },
            { source: require('@/assets/img/scify-4.jpg'), isVideo: true },
            { source: require('@/assets/img/scify-1.jpg'), isVideo: false },
            { source: require('@/assets/img/scify-2.jpg'), isVideo: false }
        ]
    },
    {
        date: 'Thu Nov 6',
        images: [
            { source: require('@/assets/img/user-2.jpg'), isVideo: false },
            { source: require('@/assets/img/user-3.jpg'), isVideo: false }
        ]
    },
    {
        date: 'Mon Oct 27',
        images: [
            { source: require('@/assets/img/scify-4.jpg'), isVideo: false },
            { source: require('@/assets/img/scify-5.jpg'), isVideo: true }
        ]
    },
    {
        date: 'Wed Oct 15',
        images: [
            { source: require('@/assets/img/scify-1.jpg'), isVideo: false },
            { source: require('@/assets/img/scify-2.jpg'), isVideo: false },
            { source: require('@/assets/img/scify-3.jpg'), isVideo: true },
            { source: require('@/assets/img/scify-4.jpg'), isVideo: false }
        ]
    }
];

export default function ArchiveScreen() {
    const insets = useSafeAreaInsets();
    const filterSheetRef = useRef<ActionSheetRef>(null);
    const folderSheetRef = useRef<ActionSheetRef>(null);
    const [isGridView, setIsGridView] = useState(false);
    return (
        <>
            <Header title="Archive"
                rightComponents={[
                    <HeaderIcon key="filter" icon="SlidersHorizontal" onPress={() => filterSheetRef.current?.show()} />,
                    <HeaderIcon key="view" icon={isGridView ? "Grid" : "Rows3"} onPress={() => setIsGridView(!isGridView)} />
                ]}
                leftComponent={[
                    <ThemedText key="title" className="text-lg font-bold mr-2">My Media</ThemedText>,
                    <HeaderIcon key="dropdown" icon="ChevronDown" onPress={() => folderSheetRef.current?.show()} />
                ]}
            />
            <AnimatedView
                animation="scaleIn"
                className='flex-1 bg-background'
                duration={300}
            >
                <ThemedScroller className="pt-10 !px-0">
                    {mediaData.map((section, sectionIndex) => (
                        <View key={sectionIndex} className="mb-6">
                            <ThemedText className="text-xl font-medium mb-4 opacity-60 px-global">
                                {section.date}
                            </ThemedText>
                            {isGridView ? (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    className="px-global"
                                >
                                    {section.images.map((image, index) => (
                                        <Link href={`/screens/${image.isVideo ? 'video-detail' : 'image-detail'}`} asChild key={index}>
                                            <Pressable className="mr-2 relative" >
                                                {image.isVideo && (
                                                    <Icon name="Video" size={20} className='absolute top-3 left-3 z-40' />
                                                )}
                                                <Image
                                                    source={image.source}
                                                    className="w-40 h-40 rounded-xl"
                                                    resizeMode="cover"
                                                />
                                            </Pressable>
                                        </Link>
                                    ))}
                                </ScrollView>
                            ) : (
                                section.images.length > 0 && (
                                    <View className="border-b-4 border-darker mb-global pb-6">
                                        <View className="flex-row mb-4 px-2">
                                            {section.images.slice(0, 2).map((image, index) => (
                                                <Link href={`/screens/${image.isVideo ? 'video-detail' : 'image-detail'}`} asChild key={index}>
                                                    <Pressable className="w-1/2 h-52 relative px-2">
                                                        {image.isVideo && (

                                                                <Icon name="Video" size={20} className='absolute top-3 left-6 z-40' />

                                                        )}
                                                        <Image
                                                            source={image.source}
                                                            className="w-full h-full  rounded-2xl"
                                                            resizeMode="cover"
                                                        />
                                                    </Pressable>
                                                </Link>
                                            ))}
                                        </View>
                                        <View className="px-global">
                                            <ThemedText className="text-lg font-semibold">
                                                Colorful Abstract Background
                                            </ThemedText>
                                            <View className="flex-row items-center justify-between">
                                                <ThemedText className="text-sm opacity-60 flex-1">
                                                    <Text className="font-medium">Remix</Text> create a colorful background...
                                                </ThemedText>
                                            </View>
                                        </View>
                                    </View>
                                )
                            )}
                        </View>
                    ))}
                </ThemedScroller>
            </AnimatedView>

            <FilterSheet ref={filterSheetRef} />
            <FolderSheet ref={folderSheetRef} />
        </>
    );
}

const FilterSheet = React.forwardRef<ActionSheetRef>((props, ref) => {
    return (
        <ActionSheetThemed gestureEnabled ref={ref}>
            <View className='p-global'>
                <ThemedText className='text-2xl font-bold mb-4'>Filter by</ThemedText>
                <FilterItem icon="Image" name='Images' />
                <FilterItem icon="Video" name='Videos' />
                <FilterItem icon="FileText" name='Prompts' />
                <FilterItem icon="Layout" name='Storyboards' />
                <FilterItem icon="RefreshCw" name='Remixes' />
                <FilterItem icon="Layers" name='Blends' />
                <FilterItem icon="Repeat" name='Loops' />
            </View>
        </ActionSheetThemed>
    );
});

const FilterItem = (props: any) => {
    return (
        <Pressable className='flex-row items-center py-4'>
            <Icon name={props.icon} size={24} className="mr-4" />
            <ThemedText className='text-lg flex-1'>{props.name}</ThemedText>
            <View className="w-6 h-6 rounded-full border-2 border-border" />
        </Pressable>
    );
};

const FolderSheet = React.forwardRef<ActionSheetRef>((props, ref) => {
    return (
        <ActionSheetThemed gestureEnabled ref={ref}>
            <View className='p-global'>
                <FolderItem isSelected icon="Folder" name='My media' />
                <FolderItem icon="Star" name='Favorites' />
                <FolderItem icon="Upload" name='Uploads' />
                <FolderItem icon="Trash" name='Trash' />
                <View className="h-px bg-border my-2" />
                <FolderItem icon="FolderPlus" name='New folder' />
                <FolderItem icon="Folder" name='Ecommerce app' />
            </View>
        </ActionSheetThemed>
    );
});

const FolderItem = (props: any) => {
    return (
        <Pressable className='flex-row items-center py-4'>
            <Icon name={props.icon} size={24} className="mr-4" />
            <ThemedText className='text-lg flex-1'>{props.name}</ThemedText>
            {props.isSelected ? (
                <View className="w-6 h-6 rounded-full bg-text border-2 border-background flex items-center justify-center">
                    <View className="w-3 h-3 bg-background rounded-full" />
                </View>
            ) : (
                <View className="w-6 h-6 rounded-full border-2 border-border" />
            )}
        </Pressable>
    );
};