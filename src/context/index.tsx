// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CurrentUser } from '@src/types/base';
// import { router } from 'expo-router';
// import React, {
//   createContext,
//   Dispatch,
//   ReactNode,
//   SetStateAction,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';

// // Define a type for user information in the context
// type UserInfo = {
//   isLoggedIn: boolean;
//   isLoading: boolean;
//   user: CurrentUser | undefined | null;
// };

// // Define a type for the context value including the setUserInfo function
// type GlobalContextType = UserInfo & {
//   setUserInfo: Dispatch<SetStateAction<UserInfo>>;
// };
// const initialState = {
//   isLoggedIn: false,
//   user: null,
//   isLoading: false,
//   setUserInfo: () => {},
// };
// const GlobalContext = createContext<GlobalContextType>(initialState);

// export const useGlobalContext = () => useContext(GlobalContext);

// const GlobalProvider = ({ children }: { children: ReactNode }) => {
//   const [userInfo, setUserInfo] = useState<UserInfo>({
//     isLoggedIn: false,
//     user: null,
//     isLoading: false,
//   });
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const auth = await AsyncStorage.getItem('auth');
//         return auth !== null ? JSON.parse(auth) : null;
//       } catch (e) {
//         // error reading value
//       }
//     };
//     getData().then((res) => {
//       console.log((res, 'ho;;;;;'));
//       if (!res) {
//         return router.replace('/(auth)/login');
//       }
//       setUserInfo((prev) => ({
//         ...prev,
//         isLoggedIn: res?.isLoggedIn,
//         user: res,
//       }));
//       router.replace('/(tabs)');
//     });
//   }, []);

//   const contextValue = useMemo(
//     () => ({ ...userInfo, setUserInfo }),
//     [userInfo]
//   );

//   return (
//     <GlobalContext.Provider value={contextValue}>
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export default GlobalProvider;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrentUser } from '@src/types/base';
import { router } from 'expo-router';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type UserInfo = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: CurrentUser | undefined | null;
};

type GlobalContextType = UserInfo & {
  setUserInfo: Dispatch<SetStateAction<UserInfo>>;
};

const initialState: GlobalContextType = {
  isLoggedIn: false,
  isLoading: false,
  user: null,
  setUserInfo: () => {}, // Placeholder, will be updated by provider
};

const GlobalContext = createContext<GlobalContextType>(initialState);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    isLoggedIn: false,
    user: null,
    isLoading: true, // Start with loading state
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const auth = await AsyncStorage.getItem('auth');
        if (auth) {
          return JSON.parse(auth);
        }
      } catch (error) {
        console.error('Error reading auth data', error);
      }
      return null;
    };

    getData().then((res) => {
      if (!res) {
        router.replace('/(auth)/login');
      } else {
        setUserInfo({
          isLoggedIn: res.isLoggedIn,
          user: res.user,
          isLoading: false,
        });
        router.replace('/(tabs)');
      }
    });
  }, []);

  const contextValue = useMemo(
    () => ({ ...userInfo, setUserInfo }),
    [userInfo]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
