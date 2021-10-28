import { Box, Text, Button, HStack, Container } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import Logo from './Logo.js';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Welcome – Goodz</title>
      </Helmet>

      <Box bg="brand.gray" minHeight="100vh" pb={24}>
        <Container maxW="container.sm" centerContent pt={20}>
          <Box maxW="450px" p={8} bgColor="white" rounded="lg">
            <Logo w="120px" />
            <Text mt={6}>
              Create a website page for your store. You can list all of your
              goods with just one link. Suitable to include in your social media
              bio. It's free.
            </Text>
            <Text mt={4}>
              If there is something you want to talk about, contact us at{' '}
              <Text
                as="span"
                bgGradient="linear(to-r, brand.green.100, brand.blue.100)"
                bgClip="text"
              >
                hi@goodz.id
              </Text>
              .
            </Text>
            <HStack mt={10} spacing={6}>
              <Button as="a" href="/signup" flexGrow={1} w="full">
                Sign up
              </Button>
              <Button
                variant="filled"
                as="a"
                href="/login"
                w="full"
                flexGrow={1}
              >
                Login
              </Button>
            </HStack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
