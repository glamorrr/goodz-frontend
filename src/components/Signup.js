import { Box, Text, Link, Container, Heading, Image } from '@chakra-ui/react';
import SignupForm from './SignupForm';
import {
  Link as ReactRouterLink,
  useHistory,
  Redirect,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import background from './background.jpg';
import useUser from '../utils/swr/useUser';

const Signup = () => {
  const history = useHistory();
  const { user } = useUser();

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <Helmet>
        <title>Sign up – Goodz</title>
      </Helmet>

      <Box bg="brand.gray" minHeight="100vh" pb={24}>
        <Image
          onClick={() => history.push('/')}
          cursor="pointer"
          src={background}
          alt="background"
          objectFit="cover"
          objectPosition="bottom"
          height="64px"
          w="full"
        />
        <Container maxW="container.sm" centerContent pt={20}>
          <Box maxW="450px" w="full" p={8} pb={20} bgColor="white" rounded="lg">
            <Heading as="h1" fontSize="3xl">
              Sign up
            </Heading>
            <SignupForm />
          </Box>
          <Text mt={4}>
            Already have an account?{' '}
            <Link
              as={ReactRouterLink}
              to="/login"
              textDecoration="underline"
              fontWeight="bold"
            >
              Login
            </Link>
          </Text>
        </Container>
      </Box>
    </>
  );
};

export default Signup;
