import Emptylist from '@components/EmptyList';
import SearchInput from '@components/SearchInput';
import VideoCard from '@components/VideoCard';
import useFetch from '@hooks/useFetch';
import { getVideosBySearch } from 'config/appwrite';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Fragment, useCallback, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const SearchQuery = () => {
  const { query } = useLocalSearchParams();
  const fetchVideos = useCallback(() => {
    return getVideosBySearch(query as string);
  }, [query]);

  const { data, refetch } = useFetch(fetchVideos);
  useEffect(() => {
    refetch();
  }, [query]);

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
              <View className="my-6">
                <Text className="font-pmedium text-sm text-gray-100">
                  Search Results
                </Text>
                <Text className="font-psemibold text-white text-2xl">
                  {query}
                </Text>
                <View className="mt-6 mb-8">
                  <SearchInput
                    initialQuery={query as string}
                    placeholder="Search for a video topic"
                  />
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <Emptylist
                title="No videos found!"
                subTitle="No videos found for this search query."
                btnText="Create video"
                path="/(tabs)/create"
              />
            )}
          />
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" />
    </Fragment>
  );
};

export default SearchQuery;

const styles = StyleSheet.create({
  rootContainer: { backgroundColor: '#161622', height: '100%' },
  container: { height: '100%' },
});
