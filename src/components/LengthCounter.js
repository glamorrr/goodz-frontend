import { Text } from '@chakra-ui/react';

const LengthCounter = ({ children }) => {
  return (
    <Text fontSize="sm" color="gray.500">
      {children}
    </Text>
  );
};

export default LengthCounter;
