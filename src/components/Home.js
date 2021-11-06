import {
  Box,
  Text,
  Button,
  HStack,
  Container,
  Heading,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import {
  HiOutlineCurrencyDollar,
  HiOutlineLink,
  HiOutlinePencilAlt,
} from 'react-icons/hi';
import Logo from './Logo.js';

const Home = () => {
  const features = [
    {
      icon: HiOutlinePencilAlt,
      title: 'Live Editing',
      description: 'All changes can be seen immediately',
    },
    {
      icon: HiOutlineLink,
      title: 'Custom Link',
      description: 'Set your link to suite your brand',
    },
    {
      icon: HiOutlineCurrencyDollar,
      title: 'Customizable Currency',
      description: '100+ currencies are supported',
    },
  ];

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
              bio. It's free. To provide this service we will display ads
              without interrupting your content.
            </Text>
            <Text mt={4}>
              If there is something you want to talk about, feel free to contact
              us at{' '}
              <Text as="span" bg="gray.900" color="white">
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
          <VStack
            maxW="450px"
            w="full"
            alignItems="flex-start"
            mt={14}
            spacing={8}
            p={8}
            bgColor="white"
            rounded="lg"
          >
            {features.map(({ title, description, icon }) => (
              <VStack alignItems="flex-start" spacing={3}>
                <Heading fontSize="2xl" fontWeight="normal">
                  <Icon fontSize="24px" as={icon} mr={2} mt={-1} />
                  {title}
                </Heading>
                <Text>{description}</Text>
              </VStack>
            ))}
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default Home;
