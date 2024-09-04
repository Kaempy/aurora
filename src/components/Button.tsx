import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  text: string;
  handlePress?: (e: GestureResponderEvent) => void;
  containerClassName?: string;
  textClassName?: string;
  isLoading?: boolean;
};

const Button = ({
  text,
  handlePress,
  containerClassName,
  textClassName,
  isLoading,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`rounded-xl w-full p-4 bg-secondary-200 mt-6 ${
        isLoading ? 'bg-gray-500' : ''
      } ${containerClassName}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Text
        className={`text-base text-center w-full text-primary font-pmedium ${textClassName}`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
