import { CurrentUser } from '@src/types/base';
import { getCurrentUser } from 'config/appwrite';
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

// Define a type for user information in the context
type UserInfo = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: CurrentUser | undefined | null;
};

// Define a type for the context value including the setUserInfo function
type GlobalContextType = UserInfo & {
  setUserInfo: Dispatch<SetStateAction<UserInfo>>;
};
const initialState = {
  isLoggedIn: false,
  user: null,
  isLoading: false,
  setUserInfo: () => {},
};
const GlobalContext = createContext<GlobalContextType>(initialState);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    isLoggedIn: false,
    user: null,
    isLoading: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      setUserInfo((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await getCurrentUser();
        setUserInfo((prev) => ({
          ...prev,
          isLoggedIn: !!res,
          user: res,
        }));
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUserInfo((prev) => ({ ...prev, isLoggedIn: false, user: null }));
      } finally {
        setUserInfo((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchUser();
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
