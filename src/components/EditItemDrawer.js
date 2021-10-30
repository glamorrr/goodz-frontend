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
  Button,
  useToast,
  Flex,
  Spinner,
  FormHelperText,
  Switch,
  NumberInputField,
  NumberInput,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import LengthCounter from './LengthCounter';
import handleError from '../utils/handleError';
import axios from 'axios';
import useCatalog from '../utils/swr/useCatalog';
import CURRENCY from '../utils/CURRENCY';
import useUser from '../utils/swr/useUser';

const EditItemDrawer = ({ isOpen = null, onClose = null, item = null }) => {
  if (isOpen === null || onClose === null) {
    throw new Error('Please pass isOpen, onClose prop to EditItemDrawer');
  }

  const initialData = {
    name: item.name,
    price: item.price,
    isHide: !item.isVisible,
  };
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const firstField = useRef();
  const toast = useToast();
  const { mutate } = useCatalog();
  const { user } = useUser();

  const handleEditItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, price, isHide } = formData;

    try {
      await mutate(async (prev) => {
        const res = await axios.put(`/items/${item.id}`, {
          name,
          price,
          isVisible: !isHide,
        });
        const updatedItem = res.data.data;

        const updatedCatalog = prev.data.map((prevCatalog) => {
          if (prevCatalog.item?.id === updatedItem.id) {
            return {
              ...prevCatalog,
              item: {
                ...prevCatalog.item,
                ...updatedItem,
              },
            };
          }

          return prevCatalog;
        });
        return { ...prev, data: updatedCatalog };
      }, false);

      onClose();
      toast({
        description: 'Item updated!',
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

  const handleDeleteItem = async () => {
    setIsDeleting(true);

    try {
      await mutate(async (prev) => {
        const res = await axios.delete(`/items/${item.id}`);
        const deletedItem = res.data.data;

        const deletedCatalog = prev.data.find(
          ({ item }) => item?.id === deletedItem.id
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
          ({ item }) => item?.id !== deletedItem.id
        );
        return { ...prev, data: updatedCatalog };
      }, false);

      onClose();
      toast({
        description: 'Item deleted!',
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

  const handleChange = (e, price) => {
    if (typeof price === 'number') {
      setFormData((prev) => ({ ...prev, price: price || 0 }));
      return;
    }

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
        <DrawerHeader borderBottomWidth="1px">Edit item</DrawerHeader>
        <DrawerBody mt={4}>
          {isDeleting ? (
            <Flex justifyContent="center" mt={16}>
              <Spinner size="lg" />
            </Flex>
          ) : (
            <Stack
              id="editItemForm"
              as="form"
              spacing="24px"
              onSubmit={handleEditItem}
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
                  isDisabled={isLoading}
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
                    isDisabled={isLoading}
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
              <Flex justifyContent="space-between" alignItems="center">
                <Button
                  onClick={handleDeleteItem}
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
                    colorScheme="teal"
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
            form="editItemForm"
            isLoading={isLoading || isDeleting}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditItemDrawer;
