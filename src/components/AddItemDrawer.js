import {
  MAX_LENGTH_CATALOG_ITEM_NAME,
  MAX_NUMBER_CATALOG_ITEM_PRICE,
  MAX_NUMBER_CATALOG_ITEM_PRICE_LABEL,
  MIN_LENGTH_CATALOG_ITEM_NAME,
  MIN_NUMBER_CATALOG_ITEM_PRICE,
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
  InputGroup,
  InputLeftAddon,
  Button,
  NumberInputField,
  NumberInput,
  useToast,
  Flex,
  FormHelperText,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import LengthCounter from './LengthCounter';
import handleError from '../utils/handleError';
import axios from 'axios';
import useCatalog from '../utils/swr/useCatalog';
import CURRENCY from '../utils/CURRENCY';
import useUser from '../utils/swr/useUser';

const AddItemDrawer = ({ isOpen = null, onClose = null }) => {
  if (isOpen === null || onClose === null) {
    throw new Error('Please pass isOpen, onClose prop to AddItemDrawer');
  }

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const firstField = useRef();
  const toast = useToast();
  const { mutate } = useCatalog();
  const { user } = useUser();

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, price } = formData;

    try {
      await mutate(async (prev) => {
        const res = await axios.post('/items', { name, price: price || 0 });
        const newCatalog = res.data.data;

        const updatedCatalog = prev.data.map((catalog) => ({
          ...catalog,
          position: catalog.position + 1,
        }));
        return { ...prev, data: [newCatalog, ...updatedCatalog] };
      }, false);

      onClose();
      toast({
        description: 'Item created!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
      setFormData({ name: '', price: 0 });
    } catch (err) {
      toast(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e, price) => {
    if (typeof price === 'number') {
      setFormData((prev) => ({ ...prev, price: price || 0 }));
      return;
    }
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
        <DrawerHeader borderBottomWidth="1px">Create a new item</DrawerHeader>
        <DrawerBody mt={4}>
          <Stack
            id="addCatalogItemForm"
            as="form"
            spacing="24px"
            onSubmit={handleAddItem}
          >
            <FormControl isRequired>
              <Flex justifyContent="space-between" alignItems="baseline">
                <FormLabel>Name</FormLabel>
                <LengthCounter>
                  {formData.name.length}/{MAX_LENGTH_CATALOG_ITEM_NAME}
                </LengthCounter>
              </Flex>
              <Input
                maxLength={MAX_LENGTH_CATALOG_ITEM_NAME}
                ref={firstField}
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              <FormHelperText>
                Name must be {MIN_LENGTH_CATALOG_ITEM_NAME} to{' '}
                {MAX_LENGTH_CATALOG_ITEM_NAME} characters
              </FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Price</FormLabel>
              <InputGroup>
                <InputLeftAddon
                  children={CURRENCY[user.currencyCode].currency}
                ></InputLeftAddon>
                <NumberInput
                  min={MIN_NUMBER_CATALOG_ITEM_PRICE}
                  max={MAX_NUMBER_CATALOG_ITEM_PRICE}
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                >
                  <NumberInputField />
                </NumberInput>
              </InputGroup>
              <FormHelperText>
                Max price is {MAX_NUMBER_CATALOG_ITEM_PRICE_LABEL}. Your
                currency is set to {CURRENCY[user.currencyCode].currency}, you
                can change it in Profile.
              </FormHelperText>
            </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button
            type="submit"
            w="full"
            form="addCatalogItemForm"
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
