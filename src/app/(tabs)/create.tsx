import Button from '@components/Button';
import FormField from '@components/FormField';
import { upload } from '@constants/icons';
import { useGlobalContext } from '@context/index';
import { Form, Post } from '@src/types/base';
import { createPost } from 'config/appwrite';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Create = () => {
  const { user } = useGlobalContext();

  const [isUpoading, setIsUpoading] = useState<boolean>(false);
  const initialState = {
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  };
  const [form, setForm] = useState<Form>(initialState);
  const openPicker = async (fileType: 'image' | 'video') => {
    // const result = await DocumentPicker.getDocumentAsync({
    //   type:
    //     fileType === 'image'
    //       ? ['image/png', 'image/jpg', 'image/svg', 'image/jpeg']
    //       : ['video/mp4', 'video/gif'],
    // });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        fileType === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (fileType === 'image') {
        setForm((prev) => ({
          ...prev,
          thumbnail: result.assets[0],
        }));
      }
      if (fileType === 'video') {
        setForm((prev) => ({ ...prev, video: result.assets[0] }));
      }
    } else {
      Alert.alert('Aborted', 'User aborted request');
    }
  };
  const onSubmit = async () => {
    setIsUpoading(true);
    try {
      const fields = Object.values(form).every(Boolean);
      if (!fields) Alert.alert('Info', 'All fields are required');
      const data: Post = {
        authorId: user?.$id,
        ...form,
      };
      const res = await createPost(data);
      console.log(res, 'done creating post...');
      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/(tabs)/');
    } catch (error) {
      if (error instanceof Error) Alert.alert('Error', error.message);
    } finally {
      setIsUpoading(false);
      setForm(initialState);
    }
  };
  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView
        contentContainerStyle={{
          height: '100%',
          flex: 1,
          display: 'flex',
        }}
        style={{
          height: '100%',
          flex: 1,
          display: 'flex',
        }}
      >
        <View className="px-4 flex-1">
          <Text className="text-white text-2xl font-psemibold">
            Upload Video
          </Text>
          <FormField
            label="Title"
            value={form.title}
            placeholder="Give your video a catchy title..."
            containerClassName="mt-10"
            onChangeText={(val) => setForm((prev) => ({ ...prev, title: val }))}
          />
          <View className="space-y-7 mt-7">
            <Text className="text-gray-100 mb-1 ms-2 text-sm font-pmedium">
              Upload Video
            </Text>
            <TouchableOpacity
              className="w-full h-48 bg-black-100 flex items-center justify-center rounded-lg overflow-hidden"
              onPress={() => openPicker('video')}
            >
              {form.video ? (
                <Video
                  resizeMode={ResizeMode.COVER}
                  source={{ uri: form.video.uri }}
                  useNativeControls
                  isLooping
                  style={styles.video}
                />
              ) : (
                <View
                  className="border items-center justify-center p-6
                h-12 rounded-lg border-dashed border-secondary/80"
                >
                  <Image
                    source={upload}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="space-y-7 mt-7">
            <Text className="text-gray-100 mb-1 ms-2 text-sm font-pmedium">
              Thumbnail Image
            </Text>
            <TouchableOpacity
              className="w-full bg-black-100 flex items-center justify-center rounded-lg overflow-hidden"
              onPress={() => openPicker('image')}
            >
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  className="w-full h-48"
                  resizeMode="contain"
                />
              ) : (
                <View className="flex-row h-16 gap-3 items-center justify-center rounded-lg">
                  <Image
                    source={upload}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                  <Text className="text-gray-400 text-base font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            label="AI Prompt"
            value={form.prompt}
            placeholder="The prompt you used to generate this video..."
            containerClassName="mt-7"
            onChangeText={(val) =>
              setForm((prev) => ({ ...prev, prompt: val }))
            }
          />
          <Button
            text="Submit & Publish"
            containerClassName="mt-10"
            handlePress={onSubmit}
            isLoading={isUpoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  rootContainer: { backgroundColor: '#161622', height: '100%' },
  container: {
    height: '100%',
    flex: 1,
    display: 'flex',
  },
  video: { width: '100%', height: '100%' },
});
