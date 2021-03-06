import {
  Box,
  AspectRatio,
  Container,
  Image,
  Heading,
  Text,
  VStack,
  Icon,
  Button,
  Stack,
  Center,
  Grid,
  Link,
  GridItem,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { HiOutlineLocationMarker, HiExternalLink } from 'react-icons/hi';
import Logo from './Logo';
import useSWR from 'swr';
import { useParams, Link as ReactRouterLink } from 'react-router-dom';
import UrlFallback from './UrlFallback';
import PageView from './PageView';
import ImagePlaceholder from './ImagePlaceholder';
import formatPrice from '../utils/formatPrice';
import usePageviewAnalytics from '../utils/usePageviewAnalytics';

const Url = () => {
  const { url } = useParams();
  const { data, error } = useSWR(`/url/${url}`, { revalidateOnFocus: true });
  usePageviewAnalytics('/:url');

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

      <PageView />

      {store.background && (
        <AspectRatio height="300px" w="full" overflow="hidden">
          <ImagePlaceholder
            blurhash={store.background.blurhash}
            width={1450}
            height={450}
          >
            <Image
              objectFit="cover"
              src={`${process.env.REACT_APP_IMAGE_URL}/${store.background.path}`}
              alt={store.name}
            />
            <Box backgroundImage="linear-gradient(rgba(6, 13, 34, 0) 20%, rgba(6, 13, 34, 0.6))" />
          </ImagePlaceholder>
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
            borderWidth={store.background ? '1px' : '0px'}
            borderStyle="solid"
            borderColor="gray.300"
            p={store.background ? 9 : 2}
            rounded="md"
          >
            {store.image ? (
              <AspectRatio w="96px" h="96px" overflow="hidden" rounded="full">
                <ImagePlaceholder
                  blurhash={store.image.blurhash}
                  width={96}
                  height={96}
                >
                  <Image
                    src={`${process.env.REACT_APP_IMAGE_URL}/${store.image.path}`}
                    alt={store.name}
                    width="96px"
                    height="96px"
                  />
                </ImagePlaceholder>
              </AspectRatio>
            ) : (
              <Box w="96px" h="96px" bg="gray.200" rounded="full" />
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
            <VStack
              mt={store.background ? 12 : 8}
              mb={12}
              spacing="32px"
              w="full"
            >
              {store.links.map(({ id, title, href, isVisible }) => {
                if (!isVisible) return <></>;
                return (
                  <Button
                    key={id}
                    as="a"
                    href={href}
                    target="_blank"
                    variant="ghost"
                    fontWeight="normal"
                    borderColor="gray.800"
                    borderTopWidth={1}
                    borderLeftWidth={1}
                    borderRightWidth={1}
                    borderBottomWidth={6}
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
                        <AspectRatio
                          ratio={1 / 1}
                          maxW="400px"
                          rounded="lg"
                          overflow="hidden"
                        >
                          {item.image ? (
                            <ImagePlaceholder
                              blurhash={item.image.blurhash}
                              width={400}
                              height={400}
                            >
                              <Image
                                src={`${process.env.REACT_APP_IMAGE_URL}/${item.image.path}`}
                                alt={item.name}
                                objectFit="cover"
                              />
                            </ImagePlaceholder>
                          ) : (
                            <Box w="400px" h="400px" bg="gray.200" />
                          )}
                        </AspectRatio>
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            maxW="400px"
                            verticalAlign="top"
                          >
                            {item.href ? (
                              <Link
                                href={item.href}
                                isExternal
                                _hover={{
                                  bg: 'gray.200',
                                  textDecoration: 'underline',
                                }}
                              >
                                {item.name}
                                <Icon
                                  mx={1}
                                  mt={-1}
                                  color="gray.900"
                                  boxSize="24px"
                                  as={HiExternalLink}
                                />
                              </Link>
                            ) : (
                              item.name
                            )}
                          </Text>
                          <Box
                            mt={3}
                            px={5}
                            py={2.5}
                            w="max-content"
                            rounded="base"
                            variant="ghost"
                            fontWeight="normal"
                            borderColor="gray.800"
                            borderTopWidth={1}
                            borderLeftWidth={1}
                            borderRightWidth={1}
                            borderBottomWidth={2}
                          >
                            <Text fontSize={{ base: 'sm', md: 'base' }}>
                              {formatPrice(item.price, store.currencyCode)}
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
                      <Heading fontSize="2xl">{header.title}</Heading>
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
