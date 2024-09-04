import { eye, eyeHide } from '@constants/icons';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface FormFieldProps extends TextInputProps {
  label: string;
  containerClassName?: string;
}

const FormField = ({ label, containerClassName, ...rest }: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const typePassword = label.toLowerCase() === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <View className={`"gap-1 w-full ${containerClassName}`}>
      <Text className="text-gray-100 font-pmedium text-base ms-2 mb-1">
        {label}
      </Text>
      <View className="bg-black-100 relative focus:border-secondary border border-[#232533] rounded-xl p-4 w-full">
        <TextInput
          className="text-white w-full"
          placeholderTextColor="#7b7b8b"
          secureTextEntry={typePassword && !showPassword}
          {...rest}
        />
        {typePassword ? (
          <Pressable
            className="absolute right-3 bottom-3"
            onPress={togglePasswordVisibility}
          >
            {showPassword ? (
              <Image
                source={eyeHide}
                resizeMode="contain"
                className="w-6 h-6"
              />
            ) : (
              <Image source={eye} resizeMode="contain" className="w-6 h-6" />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default FormField;
