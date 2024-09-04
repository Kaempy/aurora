import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment } from 'react';

const AuthLayout = () => {
  return (
    <Fragment>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </Fragment>
  );
};

export default AuthLayout;
