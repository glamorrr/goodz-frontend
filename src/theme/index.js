import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading:
      '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
    body: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
  },
  colors: {
    brand: {
      gray: '#f2f2f2',
      // gray: '#F9F9F9',
      green: { 100: '#34D399' },
      blue: { 100: '#60A5FA' },
      gradient: {
        100: 'linear-gradient(90deg, #34D399 0%, #60A5FA 100%)',
        hover: 'linear-gradient(-90deg, #34D399 0%, #60A5FA 100%)',
      },
    },
  },
  components: {
    Button: {
      // The styles all button have in common
      baseStyle: {
        borderRadius: 'base', // <-- border radius is same for all variants and sizes
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'transparent',
      },
      // Two sizes: sm and md
      sizes: {
        md: {
          fontSize: 'md',
          height: 'auto',
          py: '12px',
        },
      },
      variants: {
        filled: {
          borderColor: 'transparent',
          color: 'brand.green.100',
          bg: 'gray.50',
          _hover: {
            bg: 'gray.100',
          },
          _active: {
            bg: 'gray.300',
          },
        },
        primary: {
          bg: 'brand.gradient.100',
          border: 'none',
          color: 'white',
          _hover: {
            bg: 'brand.gradient.hover',
            _disabled: {
              bg: 'brand.gradient.100',
            },
          },
          _active: {
            bg: 'gray.200',
            color: 'brand.green.100',
            _disabled: {
              color: 'white',
            },
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
