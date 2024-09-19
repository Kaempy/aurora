import Emptylist from '@components/EmptyList';
import SearchInput from '@components/SearchInput';
import Trending from '@components/Trending';
import VideoCard from '@components/VideoCard';
import { logoSmall } from '@constants/images';
import { useGlobalContext } from '@context/index';
import useFetch from '@hooks/useFetch';
import { getLatestVideos, getVideos } from 'config/appwrite';
import { StatusBar } from 'expo-status-bar';
import React, { Fragment, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Home = () => {
  const { user } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);
  const { isLoading, data, refetch } = useFetch(getVideos);
  const { data: latestVidoes } = useFetch(getLatestVideos);
  const onRefresh = async () => {
    setRefreshing(true);
    if (!isLoading) {
      await refetch();
    }
    setRefreshing(false);
  };
  console.log(user, 'user index');
  return (
    <Fragment>
      <SafeAreaView style={styles.rootContainer}>
        <ScrollView className="flex-1 px-4">
          <FlatList
            data={data ?? []}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <VideoCard video={item} />}
            className="w-full"
            ListHeaderComponent={() => (
              <View className="my-6 space-y-6">
                <View className="mb-6 flex-row justify-between">
                  <View>
                    <Text className="font-pmedium text-sm text-gray-100">
                      Welcome back,
                    </Text>
                    <Text className="font-psemibold text-white text-2xl">
                      {user?.username}
                    </Text>
                  </View>
                  <View className="mt-1.5">
                    <Image
                      source={logoSmall}
                      resizeMode="contain"
                      className="w-9 h-10"
                    />
                  </View>
                </View>
                <SearchInput placeholder="Search for a video topic" />
                <View className="flex-1 w-full pt-8 pb-5">
                  <Text className="text-gray-100 text-lg font-pmedium">
                    Latest Videos
                  </Text>
                  <Trending posts={latestVidoes} />
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <Emptylist
                title="No videos found!"
                subTitle="No videos created yet."
                btnText="Create video"
                path="/(tabs)/create"
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" />
    </Fragment>
  );
};

export default Home;

const styles = StyleSheet.create({
  rootContainer: { backgroundColor: '#161622', height: '100%' },
  container: { height: '100%' },
});
