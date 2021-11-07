import {
  Box,
  Text,
  Button,
  HStack,
  Container,
  Heading,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
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
              bio. It's free.
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
          <Heading mt={12} fontSize="2xl" fontWeight="normal">
            Help
          </Heading>
          <Accordion allowToggle w="full" mt={4} maxW="450px">
            <AccordionItem border="none">
              <AccordionButton
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                rounded="lg"
                _hover={{ bg: 'gray.100' }}
              >
                <Box flex="1" textAlign="left">
                  What can i create?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={1}>
                You can create a simple site, you can see our page as an example
                at{' '}
                <Link
                  isExternal
                  color="blue.500"
                  href={`${window.location.origin}/goodz`}
                >
                  goodz.id/goodz
                </Link>
                .
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border="none" mt={2}>
              <AccordionButton
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                rounded="lg"
                _hover={{ bg: 'gray.100' }}
              >
                <Box flex="1" textAlign="left">
                  Do i have to pay to use this service?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={1}>Nope.</AccordionPanel>
            </AccordionItem>
            <AccordionItem border="none" mt={2}>
              <AccordionButton
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                rounded="lg"
                _hover={{ bg: 'gray.100' }}
              >
                <Box flex="1" textAlign="left">
                  My image size is too big, what should i do?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                You can visit{' '}
                <Link
                  isExternal
                  color="blue.500"
                  href="https://compressimage.io"
                >
                  compressimage.io
                </Link>{' '}
                to minify your image size.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Container>
      </Box>
    </>
  );
};

export default Home;
