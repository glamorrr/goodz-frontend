import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import handleError from '../utils/handleError';

const PageView = () => {
  const location = useLocation();
  useEffect(() => {
    (async () => {
      try {
        const currentUrl = location.pathname.substr(1);
        await axios.post(`/url/${currentUrl}/pageview`);
      } catch (err) {
        handleError(err);
      }
    })();
  }, []);

  return <></>;
};

export default PageView;
