import { Route, Redirect } from 'react-router-dom';
import useUser from '../../utils/swr/useUser';

const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useUser();

  return (
    <Route
      {...rest}
      render={() => (user ? children : <Redirect to="/login" />)}
    />
  );
};

export default PrivateRoute;
