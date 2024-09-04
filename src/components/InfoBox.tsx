import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  title: string | number;
  subTitle?: string;
  containerStyles?: string;
  titleStyles: string;
};

const InfoBox = ({ title, subTitle, containerStyles, titleStyles }: Props) => {
  return (
    <View className={`items-center ${containerStyles}`}>
      <Text className={`text-white font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-gray-100 text-sm">{subTitle}</Text>
    </View>
  );
};

export default InfoBox;
