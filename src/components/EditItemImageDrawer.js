import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Center,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormHelperText,
  VStack,
  Text,
  Image,
  AspectRatio,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import handleError from '../utils/handleError';
import axios from 'axios';
import useCatalog from '../utils/swr/useCatalog';
import { useDropzone } from 'react-dropzone';
import { HiOutlinePhotograph } from 'react-icons/hi';
import ImagePlaceholder from './ImagePlaceholder';

const EditItemImageDrawer = ({
  isOpen = null,
  onClose = null,
  item = null,
}) => {
  if (isOpen === null || onClose === null) {
    throw new Error('Please pass isOpen, onClose prop to EditItemImageDrawer');
  }

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const toast = useToast();
  const { mutate } = useCatalog();
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
      if (item.image) {
        await mutate(async (prev) => {
          const res = await axios.delete(`/images/${item.image.id}`);
          const deletedImage = res.data.data;

          const updatedCatalog = prev.data.map((prevCatalog) => {
            if (prevCatalog.item?.image?.id === deletedImage.id) {
              return {
                ...prevCatalog,
                item: {
                  ...prevCatalog.item,
                  image: null,
                },
              };
            }

            return prevCatalog;
          });
          return { ...prev, data: updatedCatalog };
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
        const res = await axios.post(`/items/${item.id}/image`, formData);
        const updatedItem = res.data.data;

        const updatedCatalog = prev.data.map((prevCatalog) => {
          if (prevCatalog.item?.id === updatedItem.id) {
            return {
              ...prevCatalog,
              item: {
                ...prevCatalog.item,
                image: { ...prevCatalog.item.image, ...updatedItem.image },
              },
            };
          }

          return prevCatalog;
        });
        return { ...prev, data: updatedCatalog };
      }, false);

      handleClose();
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
    <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Edit image</DrawerHeader>
        <DrawerBody mt={4}>
          <Text fontSize="lg" fontWeight="bold">
            {item.name}
          </Text>
          <VStack mt={4} as="form" spacing="24px" onSubmit={handleSave}>
            <FormControl isRequired>
              <FormLabel>Image</FormLabel>
              {item.image && (
                <AspectRatio boxSize="272px" overflow="hidden" rounded="md">
                  <ImagePlaceholder color={item.image.color}>
                    <Image
                      src={`${process.env.REACT_APP_IMAGE_URL}/${item.image.path}`}
                      objectFit="cover"
                      alt="preview"
                    />
                  </ImagePlaceholder>
                </AspectRatio>
              )}
              {file && (
                <AspectRatio boxSize="272px" overflow="hidden" rounded="md">
                  <Image src={file.preview} objectFit="cover" alt="preview" />
                </AspectRatio>
              )}
              {!file && !item.image && (
                <Center
                  {...getRootProps()}
                  justifyContent="center"
                  w="272px"
                  h="272px"
                  flexDirection="column"
                  border="2px dashed"
                  borderColor="gray.200"
                  rounded="md"
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
                supported. Recommended image 400x400 pixels.
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
                isDisabled={!file && !item.image}
              >
                Remove
              </Button>
            </VStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default EditItemImageDrawer;
