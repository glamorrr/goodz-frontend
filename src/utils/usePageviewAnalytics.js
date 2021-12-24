import { useEffect } from 'react';

const usePageviewAnalytics = (page) => {
  useEffect(() => {
    window.umami.trackView(page + window.location.search);
  }, []);
};

export default usePageviewAnalytics;
