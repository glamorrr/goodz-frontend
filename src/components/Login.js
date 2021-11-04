import { Box, Text, Link, Container, Heading, Image } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import {
  Link as ReactRouterLink,
  useHistory,
  Redirect,
} from 'react-router-dom';
import useUser from '../utils/swr/useUser';
import background from './background.jpg';
import LoginForm from './LoginForm';

const Login = () => {
  const { user } = useUser();
  const history = useHistory();

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <Helmet>
        <title>Login – Goodz</title>
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
              Login
            </Heading>
            <LoginForm />
          </Box>
          <Text mt={4}>
            Don't have an account?{' '}
            <Link
              as={ReactRouterLink}
              to="/signup"
              textDecoration="underline"
              fontWeight="bold"
            >
              Sign up
            </Link>
          </Text>
        </Container>
      </Box>
    </>
  );
};

export default Login;
