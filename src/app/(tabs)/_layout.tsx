import { bookmark, home, plus, profile } from '@constants/icons';
import { useColorScheme } from '@hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

type TabIconProps = {
  icon: any;
  focused: boolean;
  name: string;
  color: string;
};

const TabIcon = ({ icon, focused, name, color }: TabIconProps) => {
  return (
    <View className="items-center justify-center gap-1">
      <Image
        source={icon}
        className="w-6 h-6"
        resizeMode="contain"
        tintColor={color}
      />
      <Text
        className={`${
          focused ? 'font-psemibold text-[#ffa001]' : 'font-pregular text-white'
        } text-xs capitalize`}
      >
        {name}
      </Text>
    </View>
  );
};
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabOptions = [
    { name: 'create', icon: plus },
    { name: 'saved', icon: bookmark },
    { name: 'profile', icon: profile },
  ];
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#ffa001',
        tabBarInactiveTintColor: '#cdcde0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopColor: '#232533',
          borderTopWidth: 1,
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        key="home"
        name="index"
        options={{
          title: 'home',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} name="home" icon={home} />
          ),
        }}
      />
      {tabOptions.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.name,
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                color={color}
                name={item.name}
                icon={item.icon}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
