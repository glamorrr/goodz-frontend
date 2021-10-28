import {
  VStack,
  HStack,
  Center,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

const UrlFallback = () => {
  return (
    <>
      <Helmet>
        <title>Goodz</title>
      </Helmet>

      <Center pt="72px" flexDirection="column">
        <SkeletonCircle boxSize="96px" />
        <VStack mt={12}>
          <Skeleton height="20px" w="320px" />
          <Skeleton height="20px" w="320px" />
          <Skeleton height="20px" w="320px" />
          <Skeleton height="20px" w="320px" />
          <HStack spacing="10px">
            <Skeleton height="20px" w="190px" />
            <Skeleton height="20px" w="120px" />
          </HStack>
        </VStack>
      </Center>
    </>
  );
};

export default UrlFallback;
