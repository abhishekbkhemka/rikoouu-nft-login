import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import LogIn from "../src/components/auth/LogIn";
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'us-east-2:5f66f6e9-66a4-486b-90e3-a624f1b33dde',

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-2',



        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-2_TLJFgUkW1',
        userPoolWebClientId:'7cl7s4he1663ugelo1ulsic8ae',



        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        cookieStorage: {
            // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            // OPTIONAL - Cookie path
            path: '/',
            // OPTIONAL - Cookie expiration in days
            expires: 365,
            // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
            // OPTIONAL - Cookie secure flag
            sameSite: "strict" | "lax" | "none",
            // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
            secure: true
        },

    }
});

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    user: null,
  };

  setAuthStatus = (authenticated) => {
    this.setState({ isAuthenticated: authenticated });
  };

  setUser = (user) => {
    this.setState({ user: user });
  };

  async componentDidMount() {
    try {
        const useri = await Auth.currentAuthenticatedUser();
        console.log(useri)

        const session = await Auth.currentSession();
      this.setAuthStatus(true);
      console.log(session);
      const user = await Auth.currentAuthenticatedUser();
      this.setUser(user);
    } catch (error) {
      if (error !== 'No current user') {
        console.log(error);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser,
    };
    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <Router>
            <div>
              <Navbar auth={authProps} />
              <Switch>
                <Route
                  exact
                  path="/login"
                  render={(props) => <LogIn {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/register"
                  render={(props) => <Register {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/forgotpassword"
                  render={(props) => (
                    <ForgotPassword {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/forgotpasswordverification"
                  render={(props) => (
                    <ForgotPasswordVerification {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/changepassword"
                  render={(props) => (
                    <ChangePassword {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/changepasswordconfirmation"
                  render={(props) => (
                    <ChangePasswordConfirm {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/welcome"
                  render={(props) => <Welcome {...props} auth={authProps} />}
                />
              </Switch>
              <div
                style={{
                  display: 'grid',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                {this.state.isAuthenticated ? 'User logged in' : 'Please Login'}
              </div>
            </div>
          </Router>
        </div>
      )
    );
  }
}

export default App;
