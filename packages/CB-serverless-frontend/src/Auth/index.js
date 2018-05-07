import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import LoginForm from './LoginForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { attemptLogin } from './actionCreators';

import styles from './styles.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authScreen: 'login',
    }
  }

  handleChange = (authScreen) => {
    this.setState({
      authScreen,
    });
  }

  render() {
    let shouldDisableLogin = false;
    let requireVerification = false;
    switch(this.props.errorMessage) {
      case 'User is not confirmed.':
        shouldDisableLogin = true;
        requireVerification = true;
      case 'Incorrect username or password': {
        shouldDisableLogin = false;
        requireVerification = true;
      }
    }
    return (
      <React.Fragment>
        <div className="tab-container">
          <Tabs
            value={this.state.authScreen}
            onChange={this.handleChange}
          >
            <Tab label="Register" value="register" />
            <Tab label="Login" value="login" />
          </Tabs>
          <LoginForm
            type={this.state.authScreen}
            shouldDisableLogin={shouldDisableLogin}
            requireVerification={requireVerification}
            onSubmit={() => { this.props.attemptLogin(this.state.authScreen, requireVerification) }}
          />
        </div>
      </React.Fragment>
    );
  }
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
  attemptLogin: bindActionCreators(attemptLogin, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);