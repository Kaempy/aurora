import Emptylist from '@components/EmptyList';
import VideoCard from '@components/VideoCard';
import { search } from '@constants/icons';
import { useGlobalContext } from '@context/index';
import useFetch from '@hooks/useFetch';
import { getSavedVideos } from 'config/appwrite';
import { StatusBar } from 'expo-status-bar';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Saved = () => {
  const { user } = useGlobalContext();
  const [searchText, setSearchText] = useState('');
  const fetchVideos = useCallback(() => {
    return getSavedVideos(user!.$id, searchText);
  }, []);

  const { isLoading, data, refetch } = useFetch(fetchVideos);
  useEffect(() => {
    refetch();
  }, []);
  const onSearch = async () => {
    if (!searchText) {
      return Alert.alert(
        'Missing search query',
        'Please enter a search text to query on database'
      );
    }
    if (!isLoading) {
      await refetch();
    }
  };
  return (
    <Fragment>
      <SafeAreaView style={styles.rootContainer}>
        <View className="flex-1 px-4">
          <FlatList
            data={data ?? []}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <VideoCard video={item} />}
            className="w-full"
            ListHeaderComponent={() => (
              <View className="my-6">
                <Text className="font-pmedium text-3xl text-white">
                  Saved Videos
                </Text>
                <View className="mt-6 mb-6">
                  <View className="bg-black-100 flex-row items-center justify-between gap-4 focus:border-secondary border border-[#232533] rounded-xl py-2 px-4 w-full">
                    <TextInput
                      className="text-white"
                      placeholder="Search your saved videos"
                      placeholderTextColor="#7b7b8b"
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                    <TouchableOpacity onPress={onSearch}>
                      <Image
                        source={search}
                        resizeMode="contain"
                        className="w-5 h-5"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <Emptylist
                title="No videos found!"
                subTitle="You do not have any saved videos yet."
                btnText="Back to Explore"
                path="/(tabs)/"
              />
            )}
          />
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </Fragment>
  );
};

export default Saved;

const styles = StyleSheet.create({
  rootContainer: { backgroundColor: '#161622', height: '100%' },
  container: { height: '100%' },
});
