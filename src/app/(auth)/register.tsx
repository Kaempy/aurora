// import Button from '@components/Button';
// import FormField from '@components/FormField';
// import { useGlobalContext } from '@context/index';
// import AuthLayout from '@layout/AuthLayout';
// import { createUser } from 'config/appwrite';
// import { Link } from 'expo-router';
// import { useState } from 'react';
// import { Alert, Text, View } from 'react-native';

// const Register = () => {
//   const [form, setForm] = useState({ username: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const { setUserInfo } = useGlobalContext();

//   const handleSubmit = async () => {
//     if (!(form.username || form.email || form.password)) {
//       return Alert.alert('Error', 'Please fill in all required fields');
//     }
//     setLoading(true);
//     try {
//       const res = await createUser(form);
//       console.log(res, 'res in register');
//       Alert.alert('Success', 'User created successfully');
//       setUserInfo((prev) => ({ ...prev, user: res }));

//       // router.replace('/(tabs)');
//     } catch (error) {
//       if (error instanceof Error) {
//         console.log(error, 'err here');
//         Alert.alert('Error', error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <AuthLayout label="Sign Up">
//       <View className="w-full gap-5">
//         <FormField
//           label="Username"
//           value={form.username}
//           onChangeText={(val) =>
//             setForm((prev) => ({ ...prev, username: val }))
//           }
//           placeholder="Johnny"
//           keyboardType="default"
//         />
//         <FormField
//           label="Email"
//           value={form.email}
//           onChangeText={(val) => setForm((prev) => ({ ...prev, email: val }))}
//           placeholder="johndoe@example.com"
//           keyboardType="email-address"
//         />
//         <FormField
//           label="Password"
//           value={form.password}
//           onChangeText={(val) =>
//             setForm((prev) => ({ ...prev, password: val }))
//           }
//           placeholder="••••••••••••"
//         />
//       </View>
//       <Button
//         text="Register"
//         isLoading={loading}
//         handlePress={handleSubmit}
//         containerClassName="mt-8"
//       />
//       <Text className="text-base text-center text-gray-100 font-pmedium w-full mt-5">
//         Already have an account?&nbsp;
//         <Link href="/login" className="text-secondary-200">
//           Sign in
//         </Link>
//       </Text>
//     </AuthLayout>
//   );
// };

// export default Register;

import Button from '@components/Button';
import FormField from '@components/FormField';
import { useGlobalContext } from '@context/index';
import AuthLayout from '@layout/AuthLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, logout, signin } from 'config/appwrite';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('auth', value);
  } catch (e) {
    console.error('Error storing auth data', e);
  }
};

const Signup = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useGlobalContext();

  useEffect(() => {
    logout(); // Ensure logout on component mount
  }, []);

  const submitHandler = async () => {
    setLoading(true);
    try {
      if (!form.email || !form.password) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      await signin(form);
      const res = await getCurrentUser();

      Alert.alert('Success', 'Logged in successfully');

      const userData = {
        isLoggedIn: !!res?.email,
        user: res,
        isLoading: false,
      };
      const auth = JSON.stringify(userData);
      await storeData(auth);

      setUserInfo(userData);
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
          secureTextEntry
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
