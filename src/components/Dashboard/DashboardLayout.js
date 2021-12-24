import { Helmet } from 'react-helmet';
import {
  Box,
  Link,
  HStack,
  Flex,
  useToast,
  IconButton,
  Container,
  Icon,
  useClipboard,
  Image,
} from '@chakra-ui/react';
import {
  Link as ReactRouterLink,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { HiOutlineDuplicate } from 'react-icons/hi';
import background from '../background.jpg';
import useUser from '../../utils/swr/useUser';
import usePageviewAnalytics from '../../utils/usePageviewAnalytics';

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const toast = useToast();
  const history = useHistory();
  const location = useLocation();

  usePageviewAnalytics('/dashboard');

  const { onCopy } = useClipboard(`${window.location.origin}/${user.url}`);

  const handleCopy = () => {
    onCopy();
    toast({
      description: 'Link copied',
      status: 'success',
      position: 'top',
      duration: 3000,
    });
  };

  const menu = [
    { title: 'Links', href: '/dashboard/links' },
    { title: 'Goods', href: '/dashboard/goods' },
    { title: 'Profile', href: '/dashboard/profile' },
    { title: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard – Goodz</title>
      </Helmet>

      <Box bg="brand.gray" minHeight="100vh" pb={24}>
        <Image
          onClick={() => history.push('/dashboard/links')}
          cursor="pointer"
          src={background}
          alt="background"
          objectFit="cover"
          objectPosition="bottom"
          height="64px"
          w="full"
        />
        <Box py={2} shadow="sm" bg="white">
          <Flex alignItems="center" justifyContent="center">
            <Link
              as={ReactRouterLink}
              to={`/${user.url}`}
              display="block"
              color="gray.900"
              fontWeight="bold"
              target="_blank"
              _hover={{
                textDecoration: 'none',
                bg: 'gray.200',
              }}
            >
              {user ? `goodz.id/${user.url}` : 'goodz.id'}
            </Link>
            <IconButton
              variant="filled"
              p={1}
              fontSize="30px"
              ml={3}
              onClick={handleCopy}
              color="gray.900"
              icon={<Icon as={HiOutlineDuplicate} />}
            />
          </Flex>
        </Box>
        <Container maxW="container.sm" mt={10}>
          <HStack
            borderColor="gray.300"
            borderBottomWidth={2}
            spacing={7}
            mb={10}
            px={6}
            maxW="max-content"
          >
            {menu.map(({ title, href }) => {
              if (href === location.pathname) {
                return (
                  <Link
                    as={ReactRouterLink}
                    key={title}
                    to={href}
                    py={2}
                    marginBottom="-2px !important"
                    borderBottomWidth={2}
                    borderColor="gray.900"
                    color="gray.900"
                    _hover={{ textDecoration: 'none' }}
                  >
                    {title}
                  </Link>
                );
              }

              return (
                <Link
                  as={ReactRouterLink}
                  key={title}
                  to={href}
                  py={2}
                  borderColor="gray.300"
                  borderBottomWidth={2}
                  marginBottom="-2px !important"
                  _hover={{ color: 'gray.600', borderColor: 'gray.600' }}
                  color="gray.500"
                >
                  {title}
                </Link>
              );
            })}
          </HStack>
          {children}
        </Container>
      </Box>
    </>
  );
};

export default DashboardLayout;
