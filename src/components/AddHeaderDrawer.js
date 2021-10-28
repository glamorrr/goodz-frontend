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
  FormHelperText,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import LengthCounter from './LengthCounter';
import handleError from '../utils/handleError';
import axios from 'axios';
import useCatalog from '../utils/swr/useCatalog';

const AddItemDrawer = ({ isOpen = null, onClose = null }) => {
  if (isOpen === null || onClose === null) {
    throw new Error('Please pass isOpen, onClose prop to AddItemDrawer');
  }

  const [formData, setFormData] = useState({
    title: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const firstField = useRef();
  const toast = useToast();
  const { mutate } = useCatalog();

  const handleAddHeader = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { title } = formData;

    try {
      await mutate(async (prev) => {
        const res = await axios.post('/header', { title });
        const newCatalog = res.data.data;

        const updatedCatalog = prev.data.map((catalog) => ({
          ...catalog,
          position: catalog.position + 1,
        }));
        return { ...prev, data: [newCatalog, ...updatedCatalog] };
      }, false);

      onClose();
      toast({
        description: 'Header created!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
      setFormData({ title: '' });
    } catch (err) {
      toast(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e, price) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Create a new header</DrawerHeader>
        <DrawerBody mt={4}>
          <Stack
            id="addCatalogHeaderForm"
            as="form"
            spacing="24px"
            onSubmit={handleAddHeader}
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
              />
              <FormHelperText>
                Title must be {MIN_LENGTH_CATALOG_HEADER_TITLE} to{' '}
                {MAX_LENGTH_CATALOG_HEADER_TITLE} characters
              </FormHelperText>
            </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button
            type="submit"
            w="full"
            form="addCatalogHeaderForm"
            isLoading={isLoading}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddItemDrawer;
