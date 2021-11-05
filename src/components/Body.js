import { useEffect } from 'react';

const Body = ({ children }) => {
  useEffect(() => {
    document.body.style.background = 'var(--chakra-colors-brand-gray)';
  }, []);

  return children;
};

export default Body;
