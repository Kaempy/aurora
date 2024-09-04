import { empty } from '@src/constants/images';
import { Href, router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import Button from './Button';

const Emptylist = ({
  title,
  subTitle,
  path,
  btnText,
}: {
  title: string;
  subTitle: string;
  path: Href<string>;
  btnText: string;
}) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={empty}
        alt="Empty List"
        resizeMode="contain"
        className="w-[270px] h-[215px]"
      />
      <Text className="font-psemibold text-white text-2xl">{title}</Text>
      <Text className="font-pmedium text-sm text-gray-100 mt-2">
        {subTitle}
      </Text>
      <Button text={btnText} handlePress={() => router.push(path)} />
    </View>
  );
};

export default Emptylist;
