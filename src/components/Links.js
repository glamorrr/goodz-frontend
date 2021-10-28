import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLinks from '../utils/swr/useLinks';
import {
  Button,
  Icon,
  VStack,
  HStack,
  Text,
  Flex,
  Spinner,
  useDisclosure,
  Box,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { HiOutlineEye, HiOutlineEyeOff, HiPlus } from 'react-icons/hi';
import { MdDragHandle } from 'react-icons/md';
import AddLinkDrawer from './AddLinkDrawer';
import EditLinkDrawer from './EditLinkDrawer';
import handleError from '../utils/handleError';

const LinkItem = ({ link }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Draggable draggableId={link.id} index={link.position}>
        {(provided, snapshot) => (
          <HStack
            shadow={snapshot.isDragging ? 'outline' : 'none'}
            ref={provided.innerRef}
            {...provided.draggableProps}
            key={link.id}
            w="full"
            bg="white"
            justifyContent="space-between"
            rounded="base"
            maxW="520px"
            mb={4}
          >
            <Flex
              p={6}
              pr={0}
              flexGrow={1}
              justifyContent="space-between"
              alignItems="center"
              overflow="hidden"
              onClick={onOpen}
              cursor="pointer"
            >
              <VStack mr={4} spacing="2px" alignItems="flex-start" isTruncated>
                <Tooltip placement="top" label={link.title}>
                  <Text fontSize="lg" fontWeight="bold" isTruncated maxW="full">
                    {link.title}
                  </Text>
                </Tooltip>
                <Text isTruncated maxW="full">
                  {link.href}
                </Text>
              </VStack>
              <Tooltip
                label={link.isVisible ? 'visible' : 'hidden'}
                placement="top"
              >
                <Box>
                  <Icon
                    boxSize="24px"
                    color="gray.300"
                    as={link.isVisible ? HiOutlineEye : HiOutlineEyeOff}
                  />
                </Box>
              </Tooltip>
            </Flex>
            <Box p={6} {...provided.dragHandleProps}>
              <Icon
                cursor="grab"
                color={snapshot.isDragging ? 'gray.800' : 'gray.300'}
                boxSize="40px"
                as={MdDragHandle}
              />
            </Box>
          </HStack>
        )}
      </Draggable>
      <EditLinkDrawer isOpen={isOpen} onClose={onClose} link={link} />
    </>
  );
};

const Links = () => {
  const { links, isLoading, mutate, reorderLinks } = useLinks();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const onDragEnd = async (result) => {
    try {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }
      const sourcePosition = source.index;
      const destinationPosition = destination.index;

      await reorderLinks({
        selectedLinkId: draggableId,
        sourcePosition,
        destinationPosition,
      });
    } catch (err) {
      mutate();
      toast(handleError(err));
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        w="full"
        maxW={80}
        leftIcon={<HiPlus size="24px" />}
      >
        Add Link
      </Button>
      <AddLinkDrawer isOpen={isOpen} onClose={onClose} />
      {isLoading && (
        <Flex justifyContent="center" mt={16}>
          <Spinner size="lg" />
        </Flex>
      )}
      {!isLoading && Boolean(links?.length) && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Flex
                direction="column"
                mt={6}
                ref={provided.innerRef}
                {...provided.droppableProps}
                alignItems="flex-start"
              >
                {links.map((link) => (
                  <LinkItem key={link.id} link={link} />
                ))}
                {provided.placeholder}
              </Flex>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
};

export default Links;
