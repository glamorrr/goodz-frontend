import { Switch, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box } from '@chakra-ui/react';
import Url from './components/Url';
import Body from './components/Body';

const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard'));

const DefaultFallback = () => <Box minH="100vh" bg="brand.gray" />;

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Suspense fallback={<DefaultFallback />}>
          <Body>
            <Home />
          </Body>
        </Suspense>
      </Route>
      <Route path="/signup" exact>
        <Suspense fallback={<DefaultFallback />}>
          <Body>
            <Signup />
          </Body>
        </Suspense>
      </Route>
      <Route path="/login" exact>
        <Suspense fallback={<DefaultFallback />}>
          <Body>
            <Login />
          </Body>
        </Suspense>
      </Route>
      <Route path="/dashboard">
        <Suspense fallback={<DefaultFallback />}>
          <Body>
            <Dashboard />
          </Body>
        </Suspense>
      </Route>
      <Route path="/:url" exact>
        <Url />
      </Route>
    </Switch>
  );
};

export default App;
