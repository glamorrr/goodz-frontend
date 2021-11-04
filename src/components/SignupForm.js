import handleError from '../utils/handleError';
import {
  Text,
  Button,
  InputGroup,
  InputLeftAddon,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Flex,
  FormHelperText,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import LengthCounter from './LengthCounter';
import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_STORE_NAME,
  MAX_LENGTH_STORE_URL,
  MIN_LENGTH_PASSWORD,
} from '../utils/LENGTH';
import { useHistory } from 'react-router-dom';

const SignupForm = () => {
  const history = useHistory();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    url: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, name, url, password, confirmPassword } = formData;

    try {
      if (password !== confirmPassword) {
        throw new Error("password didn't match");
      }

      await axios.post('/auth/signup', {
        email,
        name,
        url,
        password,
      });

      history.push('/login');

      toast({
        description: 'Account created!',
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

  return (
    <form onSubmit={handleSubmit}>
      <VStack mt={8} spacing={5}>
        <FormControl id="email" w="full" isRequired>
          <Flex justifyContent="space-between" alignItems="baseline">
            <FormLabel>Email</FormLabel>
            <LengthCounter color="gray.500">
              {formData.email.length}/{MAX_LENGTH_EMAIL}
            </LengthCounter>
          </Flex>
          <Input
            maxLength={MAX_LENGTH_EMAIL}
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="Email"
            type="email"
            isDisabled={isLoading}
          />
        </FormControl>
        <FormControl id="name" w="full" isRequired>
          <Flex justifyContent="space-between" alignItems="baseline">
            <FormLabel>Name</FormLabel>
            <LengthCounter>
              {formData.name.length}/{MAX_LENGTH_STORE_NAME}
            </LengthCounter>
          </Flex>
          <Input
            maxLength={MAX_LENGTH_STORE_NAME}
            value={formData.name}
            onChange={handleChange}
            name="name"
            placeholder="Name"
            type="text"
            isDisabled={isLoading}
          />
        </FormControl>
        <FormControl id="url" w="full" isRequired>
          <Flex justifyContent="space-between" alignItems="baseline">
            <FormLabel>Your link</FormLabel>
            <LengthCounter>
              {formData.url.length}/{MAX_LENGTH_STORE_URL}
            </LengthCounter>
          </Flex>
          <InputGroup>
            <InputLeftAddon>
              <Text color="blue.500">goodz.id/</Text>
            </InputLeftAddon>
            <Input
              value={formData.url}
              maxLength={MAX_LENGTH_STORE_URL}
              onChange={handleChange}
              name="url"
              placeholder="yourstore"
              type="text"
              isDisabled={isLoading}
            />
          </InputGroup>
          <FormHelperText>
            URL can only contain numbers and letters
          </FormHelperText>
        </FormControl>
        <FormControl id="password" w="full" isRequired>
          <Flex justifyContent="space-between" alignItems="baseline">
            <FormLabel>Password</FormLabel>
            <LengthCounter>
              {formData.password.length}/{MAX_LENGTH_PASSWORD}
            </LengthCounter>
          </Flex>
          <Input
            type="password"
            maxLength={MAX_LENGTH_PASSWORD}
            onChange={handleChange}
            value={formData.password}
            name="password"
            placeholder="Password"
            isDisabled={isLoading}
          />
          <FormHelperText>
            Password must be {MIN_LENGTH_PASSWORD} to {MAX_LENGTH_PASSWORD}{' '}
            characters
          </FormHelperText>
        </FormControl>
        <FormControl id="confirmPassword" w="full" isRequired>
          <FormLabel>Confirm password</FormLabel>
          <Input
            type="password"
            onChange={handleChange}
            value={formData.confirmPassword}
            name="confirmPassword"
            placeholder="Confirm password"
            isDisabled={isLoading}
          />
        </FormControl>
      </VStack>
      <Button isLoading={isLoading} mt={8} type="submit" w="full">
        Sign up
      </Button>
    </form>
  );
};

export default SignupForm;
