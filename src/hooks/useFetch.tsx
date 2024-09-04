import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const useFetch = <T,>(getData: () => Promise<T[] | undefined>) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getData();
      if (res) setData(res);
    } catch (error) {
      if (error instanceof Error) Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [getData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const refetch = () => fetchData();
  return { isLoading, data, refetch };
};

export default useFetch;
