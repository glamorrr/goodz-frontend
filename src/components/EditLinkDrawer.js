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
  Spinner,
  FormHelperText,
  Switch,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import LengthCounter from './LengthCounter';
import handleError from '../utils/handleError';
import axios from 'axios';
import useLinks from '../utils/swr/useLinks';

const EditLinkDrawer = ({ isOpen = null, onClose = null, link = null }) => {
  if (isOpen === null || onClose === null) {
    throw new Error('Please pass isOpen, onClose prop to EditLinkDrawer');
  }

  const [formData, setFormData] = useState({
    title: link.title,
    href: link.href,
    isHide: !link.isVisible,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const firstField = useRef();
  const toast = useToast();
  const { mutate } = useLinks();

  const handleEditLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { title, href, isHide } = formData;

    try {
      await mutate(async (prev) => {
        const res = await axios.put(`/links/${link.id}`, {
          title,
          href,
          isVisible: !isHide,
        });
        const updatedLink = res.data.data;

        const updatedLinks = prev.data.map((prevLink) => {
          if (prevLink.id === updatedLink.id) {
            return {
              ...prevLink,
              ...updatedLink,
            };
          }

          return prevLink;
        });
        return { ...prev, data: updatedLinks };
      }, false);

      onClose();
      toast({
        description: 'Link updated!',
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

  const handleDeleteLink = async () => {
    setIsDeleting(true);

    try {
      await mutate(async (prev) => {
        const res = await axios.delete(`/links/${link.id}`);
        const deletedLink = res.data.data;

        let updatedLinks = prev.data.map((prevLink) => {
          if (prevLink.position > deletedLink.position) {
            return {
              ...prevLink,
              position: prevLink.position - 1,
            };
          }

          return prevLink;
        });

        updatedLinks = updatedLinks.filter(({ id }) => id !== deletedLink.id);
        return { ...prev, data: updatedLinks };
      }, false);

      onClose();
      toast({
        description: 'Link deleted!',
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
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Edit link</DrawerHeader>
        <DrawerBody mt={4}>
          {isDeleting ? (
            <Flex justifyContent="center" mt={16}>
              <Spinner size="lg" />
            </Flex>
          ) : (
            <Stack
              id="editLinkForm"
              as="form"
              spacing="24px"
              onSubmit={handleEditLink}
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
                />
                <FormHelperText>
                  Title must be {MIN_LENGTH_LINK_TITLE} to{' '}
                  {MAX_LENGTH_LINK_TITLE} characters
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
                  />
                </InputGroup>
                <FormHelperText>
                  URL must contain http:// or https://
                </FormHelperText>
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center">
                <Button
                  onClick={handleDeleteLink}
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
            form="editLinkForm"
            isLoading={isLoading || isDeleting}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditLinkDrawer;
