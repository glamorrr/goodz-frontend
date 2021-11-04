import {
  MAX_LENGTH_CATALOG_HEADER_TITLE,
  MIN_LENGTH_CATALOG_HEADER_TITLE,
} from '../utils/LENGTH';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Flex,
  Spinner,
  FormHelperText,
  Switch,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import LengthCounter from './LengthCounter';
import handleError from '../utils/handleError';
import axios from 'axios';
import useCatalog from '../utils/swr/useCatalog';

const EditHeaderDrawer = ({ isOpen = null, onClose = null, header = null }) => {
  if (isOpen === null || onClose === null) {
    throw new Error('Please pass isOpen, onClose prop to EditHeaderDrawer');
  }

  const initialData = {
    title: header.title,
    isHide: !header.isVisible,
  };
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const firstField = useRef();
  const toast = useToast();
  const { mutate } = useCatalog();

  const handleEditHeader = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { title, isHide } = formData;

    try {
      await mutate(async (prev) => {
        const res = await axios.put(`/header/${header.id}`, {
          title,
          isVisible: !isHide,
        });
        const updatedHeader = res.data.data;

        const updatedCatalog = prev.data.map((prevCatalog) => {
          if (prevCatalog.header?.id === updatedHeader.id) {
            return {
              ...prevCatalog,
              header: {
                ...prevCatalog.header,
                ...updatedHeader,
              },
            };
          }

          return prevCatalog;
        });
        return { ...prev, data: updatedCatalog };
      }, false);

      onClose();
      toast({
        description: 'Header updated!',
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

  const handleDeleteHeader = async () => {
    setIsDeleting(true);

    try {
      await mutate(async (prev) => {
        const res = await axios.delete(`/header/${header.id}`);
        const deletedHeader = res.data.data;

        const deletedCatalog = prev.data.find(
          ({ header }) => header?.id === deletedHeader.id
        );
        let updatedCatalog = prev.data.map((prevCatalog) => {
          if (prevCatalog.position > deletedCatalog.position) {
            return {
              ...prevCatalog,
              position: prevCatalog.position - 1,
            };
          }

          return prevCatalog;
        });

        updatedCatalog = updatedCatalog.filter(
          ({ header }) => header?.id !== deletedHeader.id
        );
        return { ...prev, data: updatedCatalog };
      }, false);

      onClose();
      toast({
        description: 'Header deleted!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
    } catch (err) {
      toast(handleError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.name === 'isHide' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={() => {
        onClose();
        setFormData(initialData);
      }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Edit header</DrawerHeader>
        <DrawerBody mt={4}>
          {isDeleting ? (
            <Flex justifyContent="center" mt={16}>
              <Spinner size="lg" />
            </Flex>
          ) : (
            <Stack
              id="editCatalogHeaderForm"
              as="form"
              spacing="24px"
              onSubmit={handleEditHeader}
            >
              <FormControl isRequired>
                <Flex justifyContent="space-between" alignItems="baseline">
                  <FormLabel>Title</FormLabel>
                  <LengthCounter>
                    {formData.title.length}/{MAX_LENGTH_CATALOG_HEADER_TITLE}
                  </LengthCounter>
                </Flex>
                <Input
                  maxLength={MAX_LENGTH_CATALOG_HEADER_TITLE}
                  ref={firstField}
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  isDisabled={isLoading}
                />
                <FormHelperText>
                  Title must be {MIN_LENGTH_CATALOG_HEADER_TITLE} to{' '}
                  {MAX_LENGTH_CATALOG_HEADER_TITLE} characters
                </FormHelperText>
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center">
                <Button
                  onClick={handleDeleteHeader}
                  fontWeight="normal"
                  variant="link"
                  colorScheme="red"
                >
                  Delete
                </Button>
                <FormControl
                  w="max-content"
                  display="flex"
                  alignItems="flex-end"
                  alignSelf="flex-end"
                >
                  <FormLabel m={0}>Hide</FormLabel>
                  <Switch
                    onChange={handleChange}
                    isChecked={formData.isHide}
                    name="isHide"
                    ml={2}
                    isDisabled={isLoading}
                  />
                </FormControl>
              </Flex>
            </Stack>
          )}
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button
            type="submit"
            w="full"
            form="editCatalogHeaderForm"
            isLoading={isLoading || isDeleting}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditHeaderDrawer;
