import { useRouteMatch, Switch, Redirect } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Links from '../Links';
import Catalog from '../Catalog';
import Profile from '../Profile';
import PrivateRoute from './PrivateRoute';
import Settings from '../Settings';

const Dashboard = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <PrivateRoute path={`${path}/links`} exact>
        <DashboardLayout>
          <Links />
        </DashboardLayout>
      </PrivateRoute>
      <PrivateRoute path={`${path}/goods`} exact>
        <DashboardLayout>
          <Catalog />
        </DashboardLayout>
      </PrivateRoute>
      <PrivateRoute path={`${path}/profile`} exact>
        <DashboardLayout>
          <Profile />
        </DashboardLayout>
      </PrivateRoute>
      <PrivateRoute path={`${path}/settings`} exact>
        <DashboardLayout>
          <Settings />
        </DashboardLayout>
      </PrivateRoute>
      <Redirect to={`${path}/links`} />
    </Switch>
  );
};

export default Dashboard;
