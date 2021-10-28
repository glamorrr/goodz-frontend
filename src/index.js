import { ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { SWRConfig } from 'swr';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme/index';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <SWRConfig
        value={{
          fetcher: (url) => axios.get(url).then((res) => res.data),
          revalidateOnFocus: false,
          shouldRetryOnError: false,
        }}
      >
        <Router>
          <App />
        </Router>
      </SWRConfig>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
