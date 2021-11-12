import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Button,
  Icon,
  VStack,
  HStack,
  Text,
  Image,
  Flex,
  Spinner,
  Box,
  useDisclosure,
  Tooltip,
  AspectRatio,
  Center,
  useToast,
} from '@chakra-ui/react';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePhotograph,
  HiPlus,
} from 'react-icons/hi';
import { MdDragHandle } from 'react-icons/md';
import AddItemDrawer from './AddItemDrawer';
import EditItemDrawer from './EditItemDrawer';
import EditItemImageDrawer from './EditItemImageDrawer';
import AddHeaderDrawer from './AddHeaderDrawer';
import EditHeaderDrawer from './EditHeaderDrawer';
import handleError from '../utils/handleError';
import useCatalog from '../utils/swr/useCatalog';
import useUser from '../utils/swr/useUser';
import ImagePlaceholder from './ImagePlaceholder';
import formatPrice from '../utils/formatPrice';

const CatalogItem = ({ item, position, catalogId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenImage,
    onOpen: onOpenImage,
    onClose: onCloseImage,
  } = useDisclosure();
  const { user } = useUser();

  return (
    <>
      <Draggable draggableId={catalogId} index={position}>
        {(provided, snapshot) => (
          <HStack
            shadow={snapshot.isDragging ? 'outline' : 'none'}
            ref={provided.innerRef}
            {...provided.draggableProps}
            w="full"
            bg="white"
            justifyContent="space-between"
            rounded="base"
            maxW="520px"
            mb={4}
          >
            <Flex alignItems="center" flexGrow={1} overflow="hidden">
              {item.image ? (
                <AspectRatio
                  w="72px"
                  h="72px"
                  flexShrink={0}
                  rounded="base"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={onOpenImage}
                  ml={4}
                >
                  <ImagePlaceholder color={item.image.color}>
                    <Image
                      src={`${process.env.REACT_APP_IMAGE_URL}/${item.image.path}`}
                      alt={item.name}
                      objectFit="cover"
                    />
                  </ImagePlaceholder>
                </AspectRatio>
              ) : (
                <Center
                  boxSize="72px"
                  ml={4}
                  rounded="base"
                  flexShrink={0}
                  border="2px dashed"
                  borderColor="gray.200"
                  cursor="pointer"
                  onClick={onOpenImage}
                >
                  <Icon
                    color="gray.200"
                    boxSize="32px"
                    stroke={10}
                    as={HiOutlinePhotograph}
                  />
                </Center>
              )}
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
                <VStack
                  maxW="full"
                  spacing="2px"
                  alignItems="flex-start"
                  isTruncated
                  mr="4"
                >
                  <Tooltip label={item.name} placement="top">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      isTruncated
                      maxW="full"
                    >
                      {item.name}
                    </Text>
                  </Tooltip>
                  <Text isTruncated maxW="full">
                    {formatPrice(item.price, user.currencyCode)}
                  </Text>
                </VStack>
                <Tooltip
                  label={item.isVisible ? 'visible' : 'hidden'}
                  placement="top"
                >
                  <Box>
                    <Icon
                      boxSize="24px"
                      color="gray.300"
                      as={item.isVisible ? HiOutlineEye : HiOutlineEyeOff}
                    />
                  </Box>
                </Tooltip>
              </Flex>
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
      <EditItemDrawer isOpen={isOpen} onClose={onClose} item={item} />
      <EditItemImageDrawer
        isOpen={isOpenImage}
        onClose={onCloseImage}
        item={item}
      />
    </>
  );
};

const CatalogHeader = ({ header, position, catalogId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Draggable draggableId={catalogId} index={position}>
        {(provided, snapshot) => (
          <HStack
            shadow={snapshot.isDragging ? 'outline' : 'none'}
            ref={provided.innerRef}
            {...provided.draggableProps}
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
              <VStack
                spacing="2px"
                isTruncated
                onClick={onOpen}
                alignItems="flex-start"
                mr={4}
              >
                <Tooltip label={header.title} placement="top">
                  <Text fontSize="lg" fontWeight="bold" isTruncated maxW="full">
                    {header.title}
                  </Text>
                </Tooltip>
              </VStack>
              <Tooltip
                label={header.isVisible ? 'visible' : 'hidden'}
                placement="top"
              >
                <Box>
                  <Icon
                    boxSize="24px"
                    color="gray.300"
                    as={header.isVisible ? HiOutlineEye : HiOutlineEyeOff}
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
      <EditHeaderDrawer isOpen={isOpen} onClose={onClose} header={header} />
    </>
  );
};

const Catalog = () => {
  const { catalog, isLoading, mutate, reorderCatalog } = useCatalog();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenHeader,
    onOpen: onOpenHeader,
    onClose: onCloseHeader,
  } = useDisclosure();
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

      await reorderCatalog({
        selectedCatalogId: draggableId,
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
      <HStack maxW="520px">
        <Button
          onClick={onOpen}
          w="full"
          maxW={80}
          leftIcon={<HiPlus size="24px" />}
        >
          Add Item
        </Button>
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={onOpenHeader}
          flexGrow={1}
          px={10}
          leftIcon={<HiPlus size="24px" />}
        >
          Header
        </Button>
      </HStack>
      <AddItemDrawer isOpen={isOpen} onClose={onClose} />
      <AddHeaderDrawer isOpen={isOpenHeader} onClose={onCloseHeader} />
      {isLoading && (
        <Flex justifyContent="center" mt={16}>
          <Spinner size="lg" />
        </Flex>
      )}
      {!isLoading && Boolean(catalog?.length) && (
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
                {catalog.map(({ id, item, header, position }) => {
                  if (item)
                    return (
                      <CatalogItem
                        key={id}
                        catalogId={id}
                        item={item}
                        position={position}
                      />
                    );
                  if (header)
                    return (
                      <CatalogHeader
                        key={id}
                        catalogId={id}
                        header={header}
                        position={position}
                      />
                    );
                  throw new Error('only accept item or header');
                })}
                {provided.placeholder}
              </Flex>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
};

export default Catalog;
