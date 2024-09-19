import Emptylist from '@components/EmptyList';
import InfoBox from '@components/InfoBox';
import VideoCard from '@components/VideoCard';
import { logout as logoutIcon } from '@constants/icons';
import { useGlobalContext } from '@context/index';
import useFetch from '@hooks/useFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserVideos, logout } from 'config/appwrite';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Fragment, useCallback } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { user, setUserInfo } = useGlobalContext();
  const fetchVideos = useCallback(() => {
    return getUserVideos(user?.$id as string);
  }, [user?.$id]);

  const { data, refetch } = useFetch(fetchVideos);
  const onLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('auth');
      setUserInfo({
        isLoading: false,
        isLoggedIn: false,
        user: null,
      });
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };
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
              <View className="w-full justify-center items-center mt-6 mb-12">
                <TouchableOpacity
                  className="w-full items-end mb-10"
                  onPress={onLogout}
                >
                  <Image
                    source={logoutIcon}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </TouchableOpacity>

                <View className="w-16 h-16 border border-secondary p-0.5 rounded-lg justify-center items-center">
                  <Image
                    source={{ uri: user?.avatar }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                </View>

                <InfoBox
                  title={user?.username ?? 'N/A'}
                  containerStyles="mt-5"
                  titleStyles="text-lg"
                />

                <View className="flex-row items-center justify-center w-full gap-8">
                  <InfoBox
                    title={data.length || 0}
                    subTitle="Videos"
                    titleStyles="text-xl"
                  />
                  <InfoBox
                    title="10.5K"
                    subTitle="Followers"
                    titleStyles="text-lg"
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

export default Profile;

const styles = StyleSheet.create({
  rootContainer: { backgroundColor: '#161622', height: '100%' },
  container: { height: '100%' },
});
