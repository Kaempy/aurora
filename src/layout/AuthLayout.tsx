import { logo } from '@constants/images';
import { ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthLayout = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View className="flex-1 items-start w-full h-full pt-24 justify-center px-4">
          <Image
            source={logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-white text-2xl my-10 font-psemibold">
            {label}
          </Text>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthLayout;
const styles = StyleSheet.create({
  container: { backgroundColor: '#161622', height: '100%' },
});
