import { play as playIcon } from '@constants/icons';
import { Video } from '@src/types/base';
import { AVPlaybackStatus, ResizeMode, Video as VideoPlayer } from 'expo-av';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

// const zoomIn = {
//   0: {
//     scale: 0.9,
//   },
//   1: {
//     scale: 1.1,
//   },
// };
// const zoomOut = {
//   0: {
//     scale: 1.1,
//   },
//   1: {
//     scale: 0.9,
//   },
// };
const zoomIn = {
  0: {
    transform: [{ scale: 0.9 }],
  },
  1: {
    transform: [{ scale: 1.1 }],
  },
};
const zoomOut = {
  0: {
    transform: [{ scale: 1.1 }],
  },
  1: {
    transform: [{ scale: 0.9 }],
  },
};

const TrendingVideo = ({
  activeItem,
  item,
}: {
  activeItem: string;
  item: Video;
}) => {
  const [play, setPlay] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | {}>({});
  const video = useRef(null);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <View className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40">
          <VideoPlayer
            ref={video}
            source={{
              uri: item.video,
            }}
            shouldPlay={play}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            style={styles.videoContainer}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                if (status.didJustFinish) {
                  setPlay(false);
                }
              } else if (status.error) {
                console.error(`Playback error: ${status.error}`);
                setPlay(false);
              }
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="relative justify-center items-center"
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            resizeMode="cover"
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
          />
          <Image
            source={playIcon}
            alt="play"
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: { posts: Video[] }) => {
  const [activeItem, setActiveItem] = useState<string>(posts[1]?.$id);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <ScrollView>
      <FlatList
        data={posts ?? []}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TrendingVideo activeItem={activeItem} item={item} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        contentOffset={{ x: 170, y: 0 }}
        horizontal
      />
    </ScrollView>
  );
};

export default Trending;
const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
