import useSWR from 'swr';
import { useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/toast';
import handleError from '../handleError';

const useUser = () => {
  const toast = useToast();
  const location = useLocation();

  const { data, error, mutate } = useSWR(`/store`, {
    onError: (err) => {
      const toastId = 'errorUser401Toast';
      const isDashboard = !['/login', '/signup'].includes(location.pathname);
      if (
        err?.response?.status === 401 &&
        !toast.isActive(toastId) &&
        isDashboard
      ) {
        toast({ id: toastId, ...handleError(err) });
      }
    },
  });

  return {
    user: data?.data || null,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useUser;
