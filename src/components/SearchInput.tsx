import { search } from '@src/constants/icons';
import { router, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, TextInput, TouchableOpacity, View } from 'react-native';

const SearchInput = ({
  initialQuery,
  placeholder,
}: {
  initialQuery?: string;
  placeholder: string;
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');
  return (
    <View className="bg-black-100 flex-row items-center justify-between gap-4 focus:border-secondary border border-[#232533] rounded-xl p-4 w-full">
      <TextInput
        className="text-white"
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              'Missing search query',
              'Please enter a search text to query on database'
            );
          }
          if (pathname.startsWith('/search')) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={search} resizeMode="contain" className="w-5 h-5" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
