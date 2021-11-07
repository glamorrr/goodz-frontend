import { Box } from '@chakra-ui/react';
import { BlurhashCanvas } from 'react-blurhash';

const ImagePlaceholder = ({
  children,
  width,
  height,
  blurhash,
  color,
  ...rest
}) => {
  if (blurhash) {
    return (
      <>
        <BlurhashCanvas
          hash={blurhash}
          width={width}
          height={height}
          style={{ objectFit: 'cover', objectPosition: 'right' }}
          {...rest}
        />
        {children}
      </>
    );
  }

  if (color) {
    return (
      <Box bg={color} {...rest}>
        {children}
      </Box>
    );
  }
};

export default ImagePlaceholder;
