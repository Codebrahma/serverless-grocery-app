import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './components/header';

import AuthModule from './Auth';
import ProductHome from './components/ProductHome';
import { updateAuth } from './Auth/actionCreators';

const DefaultLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div>
        <Header />
        <Component {...matchProps} />
      </div>
    )} />
  )
};

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginReady: false
    }
    // Remove when real signout component is ready
    this.handleLogout = this.handleLogout.bind(this);
  }

  async componentDidMount() {
    try {
      this.resetAndStartAuthentication();
      Auth.currentSession().then(async (response) => {
        const data = await Auth.currentAuthenticatedUser();
        this.props.updateAuth({
          isAuthenticating: false,
          isAuthenticated: true,
          identityId: data,
        })
      }).catch((error) => {
        this.finishAuthentication();
      });
    } catch (e) {
      // to do
    }
  }

  resetInitialState = () => {
    this.props.updateAuth({
      isAuthenticating: false,
      isAuthenticated: false,
      identityId: null,
    });
  }

  resetAndStartAuthentication = () => {
    this.props.updateAuth({
      isAuthenticating: true,
      isAuthenticated: false,
      identityId: null,
    });
  }

  finishAuthentication = () => {
    this.props.updateAuth({
      isAuthenticating: false
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.loginReady && this.props.isAuthenticating && !nextProps.isAuthenticating) {
      this.setState({loginReady: true});
    }
  }

  // Remove when real signout component is ready
  async handleLogout() {
    await Auth.signOut();
    this.resetInitialState();
  }

  // Remove when real component is ready
  Path1 = () => <div><h3>Path1</h3><button onClick={this.handleLogout}>Signout</button></div>
  Path2 = () => <div><h3>Path2</h3><button onClick={this.handleLogout}>Signout</button></div>

  render() {
    return (
      <Router>
        <div className="root-container">
        {
          !this.props.isAuthenticated && this.state.loginReady?
          <Route render={() => <AuthModule />} />
          :
          <React.Fragment>
            <DefaultLayout exact path='/' component={ProductHome} />
          </React.Fragment>
        }
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isAuthenticating: state.auth.isAuthenticating,
  identityId: state.auth.identityId,
});

const mapDispatchToProps = dispatch => ({
  updateAuth: bindActionCreators(updateAuth, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
