import { menu, play as playIcon } from '@constants/icons';
import { Video } from '@src/types/base';
import { ResizeMode, Video as VideoPlayer } from 'expo-av';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const VideoCard = ({
  video: { title, thumbnail, video, authorId },
}: {
  video: Video;
}) => {
  const [play, setPlay] = useState(false);
  const videoRef = useRef(null);

  return (
    <View className="items-center mb-14">
      <View className="flex-row gap-3">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg justify-center items-center p-0.5">
            <Image
              source={{ uri: authorId?.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
              progressiveRenderingEnabled
            />
          </View>
          <View className="flex-1 ml-3 justify-center">
            <Text
              className="font-pmedium text-sm text-white"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text
              className="font-pmedium text-sm text-gray-400"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {authorId?.username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {play ? (
        <View className="w-full h-60 rounded-xl mt-3 relative justify-center items-center">
          <VideoPlayer
            ref={videoRef}
            source={{
              uri: video,
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
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            alt="thumbnail"
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={playIcon}
            alt="play"
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
