import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../Login';
import Rates from '../Rates';
import Customers from '../Customers';
import Bookings from '../Bookings';
import MainLayout from '../layouts/Main';
import PrivateRoute from './PrivateRoute';
import Amenities from '../Amenities';
import Activities from '../Activities';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Home() {
  return <h2>Home</h2>;
}

const Routes: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/login" component={Login} />
      <Route>
        <MainLayout>
          <Switch>
            <PrivateRoute path="/activities" component={Activities} />
            <PrivateRoute path="/restaurants" component={Activities} />
            <PrivateRoute path="/amenities" component={Amenities} />
            <PrivateRoute path="/bookings" component={Bookings} />
            <PrivateRoute path="/customers" component={Customers} />
            <PrivateRoute path="/rates" component={Rates} />
            <PrivateRoute path="/" component={Home} />
          </Switch>
        </MainLayout>
      </Route>
    </Switch>
  </Router>
);

export default Routes;
