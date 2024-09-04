import Button from '@components/Button';
import FormField from '@components/FormField';
import { useGlobalContext } from '@context/index';
import AuthLayout from '@layout/AuthLayout';
import { getCurrentUser, logout, signin } from 'config/appwrite';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

const Signup = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    logout();
  }, []);
  const { setUserInfo } = useGlobalContext();

  const submitHandler = async () => {
    setLoading(true);
    try {
      if (!(form.email || form.password)) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      await signin(form);
      const res = await getCurrentUser();

      Alert.alert('Success', 'Logged in successfully');
      console.log(res, 'res in login');
      setUserInfo((prev) => ({ ...prev, user: res }));
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout label="Sign In">
      <View className="w-full gap-5">
        <FormField
          label="Email"
          value={form.email}
          onChangeText={(val) => setForm((prev) => ({ ...prev, email: val }))}
          placeholder="johndoe@example.com"
          keyboardType="email-address"
        />
        <FormField
          label="Password"
          value={form.password}
          onChangeText={(val) =>
            setForm((prev) => ({ ...prev, password: val }))
          }
          placeholder="••••••••••••"
        />
      </View>
      <View className="w-full items-end mt-2">
        <Link href="/#" className="font-plight text-sm text-slate-300">
          Forgot Password?
        </Link>
      </View>
      <Button
        text="Login"
        isLoading={loading}
        handlePress={submitHandler}
        containerClassName="mt-8"
      />
      <Text className="text-base text-center text-gray-100 font-pmedium w-full mt-5">
        Don't have an account?&nbsp;
        <Link href="/register" className="text-secondary-200">
          Sign up
        </Link>
      </Text>
    </AuthLayout>
  );
};

export default Signup;
