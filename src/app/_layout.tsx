import GlobalProvider from '@context/index';
import { useColorScheme } from '@hooks/useColorScheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
// Import your global CSS file
import AnimatedSplashScreen from '@components/AnimatedSplashScreen';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeInRight } from 'react-native-reanimated';
import '../../global.css';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('../../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../../assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    if (error) throw error;

    SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!appReady) {
    return (
      <AnimatedSplashScreen
        fontsLoaded={fontsLoaded}
        setAppReady={setAppReady}
      />
    );
  }

  return (
    <Animated.ScrollView
      contentContainerStyle={{ width: '100%', height: '100%' }}
      entering={FadeInRight}
    >
      <GlobalProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </GlobalProvider>
    </Animated.ScrollView>
  );
}
