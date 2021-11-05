import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Icon,
  VStack,
  Stack,
  Select,
  Switch,
  Text,
  Image,
  StackDivider,
  AspectRatio,
  Flex,
  FormHelperText,
  Box,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Center,
  Textarea,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import handleError from '../utils/handleError';
import LengthCounter from './LengthCounter';
import useUser from '../utils/swr/useUser';
import CURRENCY from '../utils/CURRENCY';
import {
  MAX_LENGTH_STORE_DESCRIPTION,
  MAX_LENGTH_STORE_LOCATION,
  MAX_LENGTH_STORE_NAME,
} from '../utils/LENGTH';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Logo from './Logo';

const IdentitySection = () => {
  const { user, mutate } = useUser();
  const [formData, setFormData] = useState({
    name: user.name,
    description: user.description || '',
    location: user.location || '',
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const { name } = formData;
    const description = formData.description || null;
    const location = formData.location || null;

    if (
      name === user.name &&
      description === user.description &&
      location === user.location
    ) {
      setIsChanged(false);
    } else {
      setIsChanged(true);
    }
  }, [formData, user.name, user.description, user.location]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name } = formData;
    const description = formData.description || null;
    const location = formData.location || null;

    try {
      await mutate(async (prev) => {
        const res = await axios.put('/store/profile', {
          name,
          description,
          location,
        });
        const updatedStore = res.data.data;
        setFormData({
          name: updatedStore.name,
          description: updatedStore.description || '',
          location: updatedStore.location || '',
        });

        return { ...prev, data: { ...prev.data, ...updatedStore } };
      }, false);

      toast({
        description: 'Profile updated!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
    } catch (err) {
      setFormData({
        name: user.name,
        description: user.description || '',
        location: user.location || '',
      });
      toast(handleError(err));
    } finally {
      setIsLoading(false);
      setIsChanged(false);
    }
  };

  return (
    <Box bg="white" w="328px" rounded="base" overflow="hidden" shadow="base">
      <Box p={8}>
        <Heading fontSize="2xl">Profile</Heading>
        <VStack
          mt={4}
          spacing={4}
          id="editStoreProfile"
          as="form"
          onSubmit={handleSave}
        >
          <FormControl isRequired>
            <Flex justifyContent="space-between" alignItems="baseline">
              <FormLabel>Name</FormLabel>
              <LengthCounter>
                {formData.name.length}/{MAX_LENGTH_STORE_NAME}
              </LengthCounter>
            </Flex>
            <Input
              maxLength={MAX_LENGTH_STORE_NAME}
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <Flex justifyContent="space-between" alignItems="baseline">
              <FormLabel>Description</FormLabel>
              <LengthCounter>
                {formData.description.length}/{MAX_LENGTH_STORE_DESCRIPTION}
              </LengthCounter>
            </Flex>
            <Textarea
              maxH="150px"
              maxLength={MAX_LENGTH_STORE_DESCRIPTION}
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl>
            <Flex justifyContent="space-between" alignItems="baseline">
              <FormLabel>Location</FormLabel>
              <LengthCounter>
                {formData.location.length}/{MAX_LENGTH_STORE_LOCATION}
              </LengthCounter>
            </Flex>
            <Textarea
              maxH="150px"
              maxLength={MAX_LENGTH_STORE_LOCATION}
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              isDisabled={isLoading}
            />
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
        form="editStoreProfile"
      >
        Save
      </Button>
    </Box>
  );
};

const ImageSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, mutate } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const toast = useToast();
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    maxSize: 5 * 1000 * 1000,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFile(
          Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0]),
          })
        );
        return;
      }
      toast({
        title: 'Image',
        description: 'Maximum file size is 5 MB',
        status: 'error',
        position: 'top',
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    if (file) URL.revokeObjectURL(file.preview);
  }, [file]);

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  const handleRemove = async () => {
    setIsLoading(true);

    try {
      if (user.image) {
        await mutate(async (prev) => {
          await axios.delete(`/images/${user.image.id}`);

          return { ...prev, data: { ...prev.data, image: null } };
        }, false);

        toast({
          description: 'Image removed!',
          status: 'success',
          position: 'top',
          duration: 3000,
        });
      }

      setFile(null);
    } catch (err) {
      toast(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      await mutate(async (prev) => {
        const res = await axios.post('/store/image', formData);
        const updatedStore = res.data.data;

        return { ...prev, data: { ...prev.data, ...updatedStore } };
      }, false);

      onClose();
      toast({
        description: 'Image updated!',
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

  return (
    <>
      <Box
        p={8}
        shadow="base"
        bg="white"
        maxW="420px"
        rounded="base"
        overflow="hidden"
      >
        <Heading fontSize="2xl">Image</Heading>
        {user.image ? (
          <Image
            mt={6}
            bg={user.image.color}
            src={`${process.env.REACT_APP_IMAGE_URL}/${user.image.path}`}
            alt={user.name}
            boxSize="146px"
            rounded="full"
            cursor="pointer"
            onClick={onOpen}
          />
        ) : (
          <Center
            mt={6}
            justifyContent="center"
            boxSize="146px"
            rounded="full"
            flexDirection="column"
            border="2px dashed"
            borderColor="gray.200"
            cursor="pointer"
            onClick={onOpen}
          >
            <Icon color="gray.100" boxSize="48px" as={HiOutlinePhotograph} />
          </Center>
        )}
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Edit profile image
          </DrawerHeader>
          <DrawerBody mt={4}>
            <VStack as="form" spacing="24px" onSubmit={handleSave}>
              <FormControl>
                <FormLabel>Image</FormLabel>
                {file || user.image ? (
                  <Image
                    src={
                      user.image
                        ? `${process.env.REACT_APP_IMAGE_URL}/${user.image.path}`
                        : file.preview
                    }
                    boxSize="272px"
                    bg={user.image?.color || 'none'}
                    objectFit="cover"
                    rounded="full"
                    alt="preview"
                  />
                ) : (
                  <Center
                    {...getRootProps()}
                    justifyContent="center"
                    w="272px"
                    h="272px"
                    flexDirection="column"
                    border="2px dashed"
                    borderColor="gray.200"
                    rounded="full"
                    cursor="pointer"
                  >
                    <Input {...getInputProps()} />
                    <Icon
                      color="gray.100"
                      boxSize="84px"
                      as={HiOutlinePhotograph}
                    />
                    <Text color="gray.200">Click or drop to upload</Text>
                  </Center>
                )}
                <FormHelperText>
                  Maximum file size is 5 MB. Only JPG, JPEG, and PNG are
                  supported. Recommended image 160x160 pixels.
                </FormHelperText>
              </FormControl>
              <VStack spacing={2} w="full">
                <Button
                  type="submit"
                  w="full"
                  isLoading={isLoading}
                  isDisabled={!file}
                >
                  Save
                </Button>
                <Button
                  onClick={handleRemove}
                  w="full"
                  variant="ghost"
                  colorScheme="red"
                  isLoading={isLoading}
                  isDisabled={!file && !user.image}
                >
                  Remove
                </Button>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const BackgroundSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, mutate } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const toast = useToast();
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    maxSize: 5 * 1000 * 1000,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFile(
          Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0]),
          })
        );
        return;
      }
      toast({
        title: 'Background',
        description: 'Maximum file size is 5 MB',
        status: 'error',
        position: 'top',
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    if (file) URL.revokeObjectURL(file.preview);
  }, [file]);

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  const handleRemove = async () => {
    setIsLoading(true);

    try {
      if (user.background) {
        await mutate(async (prev) => {
          await axios.delete(`/images/${user.background.id}`);

          return { ...prev, data: { ...prev.data, background: null } };
        }, false);

        toast({
          description: 'Background removed!',
          status: 'success',
          position: 'top',
          duration: 3000,
        });
      }

      setFile(null);
    } catch (err) {
      toast(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      await mutate(async (prev) => {
        const res = await axios.post('/store/background', formData);
        const updatedStore = res.data.data;

        return { ...prev, data: { ...prev.data, ...updatedStore } };
      }, false);

      onClose();
      toast({
        description: 'Background updated!',
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

  return (
    <>
      <Box
        shadow="base"
        p={8}
        bg="white"
        maxW="640px"
        w="full"
        rounded="base"
        overflow="hidden"
      >
        <Heading fontSize="2xl">Background</Heading>
        {user.background ? (
          <AspectRatio mt={6} ratio={1450 / 450} maxW="640px">
            <Image
              bg={user.background.color}
              src={`${process.env.REACT_APP_IMAGE_URL}/${user.background.path}`}
              alt={user.name}
              objectFit="cover"
              rounded="base"
              cursor="pointer"
              onClick={onOpen}
            />
          </AspectRatio>
        ) : (
          <AspectRatio mt={6} ratio={1450 / 450} maxW="640px">
            <Flex
              rounded="base"
              objectFit="cover"
              border="2px dashed"
              borderColor="gray.200"
              cursor="pointer"
              onClick={onOpen}
            >
              <Icon color="gray.100" boxSize="48px" as={HiOutlinePhotograph} />
            </Flex>
          </AspectRatio>
        )}
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Edit profile background
          </DrawerHeader>
          <DrawerBody mt={4}>
            <VStack as="form" spacing="24px" onSubmit={handleSave}>
              <FormControl>
                <FormLabel>Background</FormLabel>
                {file || user.background ? (
                  <Image
                    src={
                      user.background
                        ? `${process.env.REACT_APP_IMAGE_URL}/${user.background.path}`
                        : file.preview
                    }
                    w="257px"
                    h="80px"
                    bg={user.background?.color || 'none'}
                    objectFit="cover"
                    rounded="base"
                    alt="preview"
                  />
                ) : (
                  <Center
                    {...getRootProps()}
                    justifyContent="center"
                    w="257px"
                    h="80px"
                    flexDirection="column"
                    border="2px dashed"
                    borderColor="gray.200"
                    rounded="base"
                    cursor="pointer"
                  >
                    <Input {...getInputProps()} />
                    <Icon
                      color="gray.100"
                      boxSize="32px"
                      as={HiOutlinePhotograph}
                    />
                    <Text color="gray.200">Click or drop to upload</Text>
                  </Center>
                )}
                <FormHelperText>
                  Maximum file size is 5 MB. Only JPG, JPEG, and PNG are
                  supported. Recommended background 1450x450 pixels.
                </FormHelperText>
              </FormControl>
              <VStack spacing={2} w="full">
                <Button
                  type="submit"
                  w="full"
                  isLoading={isLoading}
                  isDisabled={!file}
                >
                  Save
                </Button>
                <Button
                  onClick={handleRemove}
                  w="full"
                  variant="ghost"
                  colorScheme="red"
                  isLoading={isLoading}
                  isDisabled={!file && !user.background}
                >
                  Remove
                </Button>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const SettingsSection = () => {
  const { user, mutate } = useUser();
  const [isCredit, setIsCredit] = useState(user.isCredit);
  const [isLoadingIsCredit, setIsLoadingIsCredit] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(user.currencyCode);
  const [isLoadingSelectedCurrency, setIsLoadingSelectedCurrency] =
    useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      if (isCredit !== user.isCredit) {
        setIsLoadingIsCredit(true);
        try {
          await mutate(async (prev) => {
            const res = await axios.put(`/store/is_credit`, { isCredit });
            const updatedStore = res.data.data;
            return { ...prev, data: { ...prev.data, ...updatedStore } };
          }, false);
          toast({
            description: 'Show credit updated!',
            status: 'success',
            position: 'top',
            duration: 3000,
          });
        } catch (err) {
          toast(handleError(err));
          setIsCredit(user.isCredit);
        } finally {
          setIsLoadingIsCredit(false);
        }
      }
    })();
  }, [isCredit, user.isCredit, mutate, toast]);

  useEffect(() => {
    (async () => {
      if (selectedCurrency !== user.currencyCode) {
        setIsLoadingSelectedCurrency(true);
        try {
          await mutate(async (prev) => {
            const res = await axios.put(`/store/currency`, {
              currencyCode: selectedCurrency,
            });
            const updatedStore = res.data.data;
            return { ...prev, data: { ...prev.data, ...updatedStore } };
          }, false);
          toast({
            description: `Currency changed to ${CURRENCY[selectedCurrency].currency}!`,
            status: 'success',
            position: 'top',
            duration: 3000,
          });
        } catch (err) {
          toast(handleError(err));
          setSelectedCurrency(user.currencyCode);
        } finally {
          setIsLoadingSelectedCurrency(false);
        }
      }
    })();
  }, [selectedCurrency, user.currencyCode, mutate, toast]);

  return (
    <VStack
      shadow="base"
      spacing="32px"
      p={8}
      bg="white"
      maxW="540px"
      w="full"
      rounded="base"
      overflow="hidden"
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Flex justifyContent="space-between" w="full" alignItems="Center">
        <Heading fontSize="xl">
          <Box as="span" mr={2}>
            Show credit
          </Box>
          <Logo display="inline-block" w="80px" mb={-1} />
        </Heading>
        <Switch
          ml={6}
          onChange={() => setIsCredit(!isCredit)}
          isChecked={isCredit}
          name="isCredit"
          size="lg"
          isDisabled={isLoadingIsCredit}
        />
      </Flex>
      <Box w="full">
        <Heading fontSize="xl">Currency</Heading>
        <FormControl isRequired mt={4}>
          <FormLabel>Choose your currency</FormLabel>
          <Select
            maxW="300px"
            onChange={(e) => setSelectedCurrency(e.target.value)}
            value={selectedCurrency}
            isDisabled={isLoadingSelectedCurrency}
          >
            {Object.keys(CURRENCY)
              .map((countryCode) => ({
                name: `${CURRENCY[countryCode].countryName} (${CURRENCY[countryCode].currency})`,
                value: countryCode,
              }))
              .sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
              })
              .map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
          </Select>
        </FormControl>
      </Box>
    </VStack>
  );
};

const ViewsSection = () => {
  const { user } = useUser();

  const {
    pageviews: { allTime, last30Days },
  } = user;

  const NumberViewCard = ({ value, label, ...rest }) => {
    return (
      <VStack
        w="200px"
        h="140px"
        rounded="base"
        bg="gray.50"
        spacing={1}
        justifyContent="center"
        {...rest}
      >
        <Text fontSize="2xl">{value}</Text>
        <Text color="gray.400">{label}</Text>
      </VStack>
    );
  };

  return (
    <VStack
      shadow="base"
      spacing="36px"
      p={8}
      bg="white"
      maxW="540px"
      rounded="base"
      overflow="hidden"
      alignItems="flex-start"
      divider={<StackDivider borderColor="gray.200" />}
    >
      <VStack spacing={5} alignItems="flex-start">
        <Heading fontSize="xl">Last 30 Days Views</Heading>
        <Flex direction={{ base: 'column', md: 'row' }}>
          <NumberViewCard
            value={allTime.mobile}
            label="Mobile"
            mb={{ base: 8, md: 0 }}
            mr={{ base: 0, md: 8 }}
          />
          <NumberViewCard value={allTime.desktop} label="Desktop" />
        </Flex>
        <Text fontStyle="italic" color="gray.400">
          Since{' '}
          {new Date(
            new Date().getTime() - 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </VStack>
      <VStack spacing={5} alignItems="flex-start">
        <Heading fontSize="xl">All Time Views</Heading>
        <Flex direction={{ base: 'column', md: 'row' }}>
          <NumberViewCard
            value={last30Days.mobile}
            label="Mobile"
            mb={{ base: 8, md: 0 }}
            mr={{ base: 0, md: 8 }}
          />
          <NumberViewCard value={last30Days.desktop} label="Desktop" />
        </Flex>
      </VStack>
    </VStack>
  );
};

const Profile = () => {
  return (
    <VStack spacing="48px" alignItems="flex-start">
      <Stack
        spacing="48px"
        direction={{ base: 'column', md: 'row' }}
        alignItems="flex-start"
      >
        <IdentitySection />
        <ImageSection />
      </Stack>
      <BackgroundSection />
      <SettingsSection />
      <ViewsSection />
    </VStack>
  );
};

export default Profile;
