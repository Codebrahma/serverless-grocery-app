import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import styled from 'styled-components';

import LoginForm from './LoginForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { attemptLogin } from './actionCreators';

import styles from './styles.css';

const LoginContainer = styled.div`
    background: #fff;
    margin: 2em auto;
    padding: 0px 0px 50px;
    box-shadow: 0px 0px 25px 4px #ddd;
    height: auto;
    min-height: 400px;
    vertical-align: middle;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translate(0%, 50%);
    
    @media (min-width: 1280px) {
        width: 40%;
    }
    
    @media (max-width: 1279px){    
        width: 60%;
    }
    
    @media (min-width: 601px) and (max-width: 800px){    
        width: 100%;
    }
    
    @media (max-width: 600px){    
        width: 80%;
        transform: translateY(0);
    }
    
    @media (max-width: 480px){    
        width: 100%;
        margin: 0;
        transform: translateY(0);
    }
    
`;

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
        <LoginContainer>
          <Tabs
            value={this.state.authScreen}
            onChange={this.handleChange}
          >
            <Tab label="Register" value="register" />
            <Tab label="Login" value="login" />
          </Tabs>
          {
            this.props.errorMessage &&
            <div className={"error-message"}>{this.props.errorMessage}</div>
          }
          <LoginForm
            type={this.state.authScreen}
            shouldDisableLogin={shouldDisableLogin}
            requireVerification={requireVerification}
            onSubmit={() => { this.props.attemptLogin(this.state.authScreen, requireVerification) }}
          />
        </LoginContainer>
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  attemptLogin: bindActionCreators(attemptLogin, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
