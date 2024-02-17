import React from 'react';
import Navbar from './Components/Navbar';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthContextProvider } from './context/AuthContext';

import AdminLayout from './Layout/admin';
import AuthLayout from './Layout/auth';

import Home from './Components/Home';
import Login from './Components/Login';
import Abonnement from './Components/Abonnement';

const App = () => {
  const { currentUser, user } = useContext(AuthContext);

  console.log('route ######user', user);

  const history = useHistory();

  const RequireAuth = ({ children }) => {
    return currentUser ? children : history.push('/login');
  };

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/home" component={Home} exact>
            {' '}
            <Home />
          </Route>
          <Route path="/abonnement" component={Abonnement} exact>
            {' '}
            <Abonnement />
          </Route>
          <Route path="/login" component={Login} exact>
            {' '}
            <Login />
          </Route>
          <AuthContextProvider>
            <RequireAuth>
              <Route path="/" render={props => <AdminLayout {...props} />} />
              <Route path="/auth" render={props => <AuthLayout {...props} />} />
            </RequireAuth>
          </AuthContextProvider>
        </Switch>
      </Router>
    </>
  );
};

export default App;
