import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputLeftAddon,
  InputGroup,
  Button,
  Icon,
  VStack,
  Text,
  Flex,
  FormHelperText,
  Box,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Heading,
  useToast,
} from '@chakra-ui/react';
import handleError from '../utils/handleError';
import LengthCounter from './LengthCounter';
import useUser from '../utils/swr/useUser';
import { MAX_LENGTH_STORE_URL } from '../utils/LENGTH';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const AccountSection = () => {
  const { user, mutate } = useUser();
  const [url, setUrl] = useState(user.url);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (url === user.url) {
      setIsChanged(false);
    } else {
      setIsChanged(true);
    }
  }, [url, user.url]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await mutate(async (prev) => {
        const res = await axios.put('/store/url', { url });
        const updatedStore = res.data.data;
        setUrl(updatedStore.url);

        return { ...prev, data: { ...prev.data, ...updatedStore } };
      }, false);

      toast({
        description: 'Your link updated!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
    } catch (err) {
      toast(handleError(err));
      setUrl(user.url);
    } finally {
      setIsLoading(false);
      setIsChanged(false);
    }
  };

  return (
    <Box bg="white" maxW="360px" rounded="base" overflow="hidden">
      <Box p={8}>
        <Heading fontSize="2xl">Account</Heading>
        <VStack
          mt={4}
          spacing={4}
          id="editAccount"
          as="form"
          onSubmit={handleSave}
        >
          <FormControl isRequired>
            <Flex justifyContent="space-between" alignItems="baseline">
              <FormLabel>Your link</FormLabel>
              <LengthCounter>
                {url.length}/{MAX_LENGTH_STORE_URL}
              </LengthCounter>
            </Flex>
            <InputGroup>
              <InputLeftAddon>
                <Text
                  bgGradient="linear(to-r, brand.green.100, brand.blue.100)"
                  bgClip="text"
                >
                  goodz.id/
                </Text>
              </InputLeftAddon>
              <Input
                maxLength={MAX_LENGTH_STORE_URL}
                name="name"
                placeholder="Name"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                isDisabled={isLoading}
              />
            </InputGroup>
          </FormControl>
        </VStack>
      </Box>
      <Button
        w="full"
        mt={2}
        roundedTop="none"
        isDisabled={!isChanged}
        isLoading={isLoading}
        type="submit"
        form="editAccount"
      >
        Save
      </Button>
    </Box>
  );
};

const LogoutSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { mutate } = useUser();

  const handleLogout = async (e) => {
    setIsLoading(true);

    try {
      await axios.post('/auth/logout');
      history.push('/');
      mutate(null, false);

      toast({
        description: 'Logout success, see you later!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
    } catch (err) {
      toast(handleError(err));
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box bg="white" maxW="360px" rounded="base" overflow="hidden">
        <Box p={8}>
          <Heading fontSize="2xl">Logout</Heading>
          <VStack mt={4} spacing={4}>
            <Text>Logout from your account.</Text>
          </VStack>
        </Box>
        <Button
          w="full"
          variant="solid"
          colorScheme="gray"
          onClick={onOpen}
          mt={2}
          roundedTop="none"
        >
          Logout
        </Button>
      </Box>
      <Modal onClose={onClose} size="xs" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure?</Text>
          </ModalBody>
          <ModalFooter mt={6} p={0} display="flex" overflow="hidden">
            <Button
              variant="solid"
              w="full"
              colorScheme="gray"
              onClick={onClose}
              roundedTop="none"
              roundedBottomRight="none"
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              w="full"
              colorScheme="gray"
              roundedTop="none"
              roundedBottomLeft="none"
              onClick={handleLogout}
              isLoading={isLoading}
            >
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const DeleteAccountSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const toast = useToast();
  const history = useHistory();
  const { mutate } = useUser();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.delete('/user', { data: { password } });
      history.push('/');
      mutate(null, false);

      toast({
        description: 'Account deleted!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
    } catch (err) {
      toast(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <>
      <Box bg="white" rounded="base" overflow="hidden">
        <Box p={8}>
          <Heading fontSize="2xl">Delete Account</Heading>
          <VStack mt={4} spacing={4}>
            <Text>Permanently delete your data and can't be recovered.</Text>
          </VStack>
        </Box>
        <Button
          w="full"
          variant="solid"
          colorScheme="red"
          onClick={onOpen}
          leftIcon={<Icon as={HiOutlineExclamationCircle} />}
          mt={2}
          roundedTop="none"
        >
          Delete account
        </Button>
      </Box>
      <Modal onClose={handleClose} size="xs" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              as="form"
              onSubmit={handleDeleteAccount}
              id="deleteAccountForm"
            >
              <FormControl id="password" w="full" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  isDisabled={isLoading}
                />
                <FormHelperText>
                  Insert your password to delete your account. If you click
                  Delete, all your data will be deleted.
                </FormHelperText>
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter mt={10} p={0} display="flex" overflow="hidden">
            <Button
              variant="solid"
              w="full"
              colorScheme="blue"
              onClick={handleClose}
              roundedTop="none"
              roundedBottomRight="none"
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              w="full"
              colorScheme="red"
              roundedTop="none"
              roundedBottomLeft="none"
              type="submit"
              isLoading={isLoading}
              form="deleteAccountForm"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Settings = () => {
  return (
    <VStack spacing="48px" alignItems="flex-start">
      <AccountSection />
      <LogoutSection />
      <DeleteAccountSection />
    </VStack>
  );
};

export default Settings;
