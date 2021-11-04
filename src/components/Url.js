import {
  Box,
  AspectRatio,
  Container,
  Image,
  Heading,
  Text,
  VStack,
  Icon,
  Flex,
  Button,
  Stack,
  Center,
  Grid,
  Link,
  GridItem,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import CURRENCY from '../utils/CURRENCY';
import { HiOutlinePhotograph, HiOutlineLocationMarker } from 'react-icons/hi';
import Logo from './Logo';
import useSWR from 'swr';
import { useParams, Link as ReactRouterLink } from 'react-router-dom';
import UrlFallback from './UrlFallback';

const Url = () => {
  const { url } = useParams();
  const { data, error } = useSWR(`/url/${url}`, { revalidateOnFocus: true });

  const store = data?.data;

  if (error?.response?.status === 404) {
    return (
      <>
        <Helmet>
          <title>404 Not Found – Goodz</title>
        </Helmet>
        <Center pt={24} flexDirection="column">
          <Heading as="h1" fontSize="8xl" mb={4}>
            404
          </Heading>
          <Link to="/" as={ReactRouterLink}>
            <Logo w="72px" />
          </Link>
        </Center>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Oops! Something went wrong – Goodz</title>
        </Helmet>
        <p>Oops! Something went wrong.</p>
      </>
    );
  }

  if (!store) return <UrlFallback />;

  return (
    <>
      <Helmet>
        <title>{store.name}</title>
      </Helmet>

      {store.background && (
        <AspectRatio height="300px" w="full" overflow="hidden">
          <>
            <Image
              objectFit="cover"
              objectPosition="bottom"
              bg={store.background.color}
              src={`${process.env.REACT_APP_IMAGE_URL}/${store.background.path}`}
              alt={store.name}
            />
            <Box backgroundImage="linear-gradient(rgba(6, 13, 34, 0) 20%, rgba(6, 13, 34, 0.6))" />
          </>
        </AspectRatio>
      )}
      <Box
        pb={24}
        mt={store.background ? -40 : 0}
        zIndex="1"
        position="relative"
      >
        <Container maxW="container.sm" centerContent pt={16}>
          <VStack
            spacing={5}
            alignItems="center"
            maxW="320px"
            bg={'white'}
            shadow={store.background ? 'sm' : 'none'}
            p={store.background ? 9 : 2}
            rounded="md"
          >
            {store.image ? (
              <Image
                bg={store.image.color}
                rounded="full"
                boxSize="96px"
                src={`${process.env.REACT_APP_IMAGE_URL}/${store.image.path}`}
                alt={store.name}
              />
            ) : (
              <Center rounded="full" boxSize="96px" bg="gray.50">
                <Icon
                  color="gray.100"
                  boxSize="40px"
                  as={HiOutlinePhotograph}
                />
              </Center>
            )}
            <Heading as="h1" fontSize="xl" textAlign="center">
              {store.name}
            </Heading>
          </VStack>

          {store.description && (
            <Text
              mt={store.background ? 8 : 4}
              mb={2}
              maxW="320px"
              textAlign="center"
            >
              {store.description}
            </Text>
          )}

          {store.location && (
            <Text
              mt={store.background ? 6 : 4}
              mb={2}
              maxW="360px"
              textAlign="center"
            >
              <Icon
                color="gray.900"
                boxSize="20px"
                as={HiOutlineLocationMarker}
                mr={2}
                mt={-1}
              />
              {store.location}
            </Text>
          )}
          {Boolean(store.links.length) && (
            <VStack mt={8} mb={12} spacing="32px" w="full">
              {store.links.map(({ id, title, href, isVisible }) => {
                if (!isVisible) return <></>;
                return (
                  <Button
                    key={id}
                    as="a"
                    href={href}
                    target="_blank"
                    variant="storeLink"
                    w="full"
                  >
                    {title}
                  </Button>
                );
              })}
            </VStack>
          )}
        </Container>
        {Boolean(store.catalog.length) && (
          <Container maxW="container.lg" centerContent my={12}>
            <Grid
              gap={{ base: '32px' }}
              columnGap={{ lg: '48px' }}
              w="full"
              templateColumns={{ sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            >
              {store.catalog.map(({ id, item, header }, i) => {
                if (item && item.isVisible) {
                  return (
                    <GridItem key={id}>
                      <Stack spacing={4}>
                        <AspectRatio ratio={1 / 1} maxW="400px">
                          {item.image ? (
                            <Image
                              src={`${process.env.REACT_APP_IMAGE_URL}/${item.image.path}`}
                              alt={item.name}
                              bg={item.image.color}
                            />
                          ) : (
                            <Flex bg="gray.50">
                              <Icon
                                color="gray.100"
                                boxSize="120px"
                                as={HiOutlinePhotograph}
                              />
                            </Flex>
                          )}
                        </AspectRatio>
                        <Box>
                          <Text fontWeight="bold" fontSize="lg" maxW="400px">
                            {item.name}
                          </Text>
                          <Box
                            mt={3}
                            px={5}
                            py={2.5}
                            border="1px solid"
                            borderColor="gray.900"
                            w="max-content"
                          >
                            <Text fontSize={{ base: 'sm', md: 'base' }}>
                              {new Intl.NumberFormat(store.currencyCode, {
                                style: 'currency',
                                currency: CURRENCY[store.currencyCode].currency,
                                currencyDisplay: 'code',
                              }).format(item.price)}
                            </Text>
                          </Box>
                        </Box>
                      </Stack>
                    </GridItem>
                  );
                }

                if (header && header.isVisible) {
                  return (
                    <GridItem
                      mt={i !== 0 ? 8 : 0}
                      key={id}
                      colSpan={{ sm: 2, md: 3 }}
                    >
                      <Heading
                        fontSize="2xl"
                        paddingBottom={2}
                        borderBottom="1px solid"
                        borderColor="gray.900"
                      >
                        {header.title}
                      </Heading>
                    </GridItem>
                  );
                }

                return <></>;
              })}
            </Grid>
          </Container>
        )}
        {store.isCredit && (
          <Center mt={32}>
            <Link to="/" as={ReactRouterLink}>
              <Logo w="84px" />
            </Link>
          </Center>
        )}
      </Box>
    </>
  );
};

export default Url;
