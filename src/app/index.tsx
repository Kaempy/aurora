import Button from '@components/Button';
import { cards, logo, path } from '@constants/images';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View className="w-full h-full flex-1 items-center justify-center px-4">
            <Image
              source={logo}
              resizeMode="contain"
              className="w-[130px] h-[84px]"
            />
            <Image
              source={cards}
              resizeMode="contain"
              className="max-w-[380px] w-full h-[300px]"
            />
            <View className="relative mt-5">
              <Text className="font-pbold text-white text-3xl text-center">
                Discover Endless Possibilities with &nbsp;
                <Text className="text-secondary">Aurora</Text>
              </Text>
              <Image
                source={path}
                resizeMode="contain"
                className="w-[100px] absolute right-0 -bottom-4"
              />
            </View>
            <Text className="text-sm text-gray-100 font-pregular text-center mt-8">
              Where Creativity Meets Innovation: Embark on a Journey of
              Limitless Exploration with Aurora
            </Text>
            <Button
              text="Continue with Email"
              handlePress={() => router.push('./login')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar backgroundColor="#161622" style="light" />
    </Fragment>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    height: '100%',
  },
});
