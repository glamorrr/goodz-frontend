import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading:
      '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
    body: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
  },
  colors: {
    brand: {
      gray: '#F7F0EA',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'base',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'transparent',
      },
      sizes: {
        md: {
          fontSize: 'md',
          height: 'auto',
          py: '12px',
        },
      },
      variants: {
        filled: {
          color: 'brand.gray.900',
          bg: 'gray.50',
          _hover: {
            bg: 'gray.100',
          },
          _active: {
            bg: 'gray.300',
          },
        },
        primary: {
          bg: 'gray.900',
          borderColor: 'gray.900',
          color: 'white',
          _hover: {
            bg: 'gray.100',
            color: 'gray.900',
            _disabled: {
              bg: 'gray.900',
              color: 'white',
            },
          },
          _active: {
            bg: 'gray.300',
          },
        },
        storeLink: {
          lineHeight: 1.5,
          bg: 'white',
          whiteSpace: 'none',
          textAlign: 'center',
          fontWeight: 'normal',
          borderColor: 'black',
          color: 'black',
          rounded: 'none',
          boxShadow: '12px 12px 0px #000000',
          transitionDuration: 0,
          _hover: {
            transform: 'translate(2px,2px)',
            boxShadow: '8px 8px 0px #000000',
          },
          _focus: {
            boxShadow: '8px 8px 0px #000000',
            bg: 'gray.100',
          },
        },
      },
      defaultProps: {
        size: 'md',
        variant: 'primary',
      },
    },
    Input: {
      sizes: {
        md: {
          field: {
            borderRadius: 'none',
          },
          addon: {
            borderRadius: 'none',
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Textarea: {
      sizes: {
        md: {
          borderRadius: 'none',
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    NumberInput: {
      sizes: {
        md: {
          field: {
            borderRadius: 'none',
          },
          addon: {
            borderRadius: 'none',
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
  },
});

export default theme;
