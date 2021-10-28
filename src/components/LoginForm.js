import handleError from '../utils/handleError';
import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useUser from '../utils/swr/useUser';

const LoginForm = () => {
  const history = useHistory();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useUser();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = formData;

    try {
      await axios.post('/auth/login', { email, password });
      await mutate();

      history.push('/dashboard');

      toast({
        description: 'Login success!',
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
          <FormLabel>Email</FormLabel>
          <Input
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="Email"
            type="email"
          />
        </FormControl>
        <FormControl id="password" w="full" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={handleChange}
            value={formData.password}
            name="password"
            placeholder="Password"
          />
        </FormControl>
      </VStack>
      <Button isLoading={isLoading} mt={8} type="submit" w="full">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
