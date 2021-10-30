import { MAX_LENGTH_LINK_TITLE, MIN_LENGTH_LINK_TITLE } from '../utils/LENGTH';
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
  FormHelperText,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import LengthCounter from './LengthCounter';
import handleError from '../utils/handleError';
import axios from 'axios';
import useLinks from '../utils/swr/useLinks';

const AddLinkDrawer = ({ isOpen = null, onClose = null }) => {
  if (isOpen === null || onClose === null) {
    throw new Error('Please pass isOpen, onClose prop to AddLinkDrawer');
  }

  const [formData, setFormData] = useState({
    title: '',
    href: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const firstField = useRef();
  const toast = useToast();
  const { mutate } = useLinks();

  const handleAddLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { title, href } = formData;

    try {
      await mutate(async (prev) => {
        const res = await axios.post('/links', { title, href });
        const newLink = res.data.data;
        const updatedLinks = prev.data.map((link) => ({
          ...link,
          position: link.position + 1,
        }));
        return { ...prev, data: [newLink, ...updatedLinks] };
      }, false);

      onClose();
      toast({
        description: 'Link created!',
        status: 'success',
        position: 'top',
        duration: 3000,
      });
      setFormData({ title: '', href: '' });
    } catch (err) {
      toast(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
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
        <DrawerHeader borderBottomWidth="1px">Create a new link</DrawerHeader>
        <DrawerBody mt={4}>
          <Stack
            id="addLinkForm"
            as="form"
            spacing="24px"
            onSubmit={handleAddLink}
          >
            <FormControl isRequired>
              <Flex justifyContent="space-between" alignItems="baseline">
                <FormLabel>Title</FormLabel>
                <LengthCounter>
                  {formData.title.length}/{MAX_LENGTH_LINK_TITLE}
                </LengthCounter>
              </Flex>
              <Input
                maxLength={MAX_LENGTH_LINK_TITLE}
                ref={firstField}
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                isDisabled={isLoading}
              />
              <FormHelperText>
                Title must be {MIN_LENGTH_LINK_TITLE} to {MAX_LENGTH_LINK_TITLE}{' '}
                characters
              </FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>URL</FormLabel>
              <InputGroup>
                <Input
                  type="url"
                  name="href"
                  placeholder="https://example.com"
                  value={formData.href}
                  onChange={handleChange}
                  isDisabled={isLoading}
                />
              </InputGroup>
              <FormHelperText>
                URL must contain http:// or https://
              </FormHelperText>
            </FormControl>
          </Stack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button
            type="submit"
            w="full"
            form="addLinkForm"
            isLoading={isLoading}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddLinkDrawer;
