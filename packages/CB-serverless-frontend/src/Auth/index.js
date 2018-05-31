import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import styled from 'styled-components';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {USER_NOT_VERIFIED, USER_ALREADY_EXIST} from '../constants/app';
import { RaisedButton } from 'material-ui';
import VerificationForm from './VerificationForm';
import ForgotPassword from './ForgotPasswordForm';

import {
  attemptLogin,
  requestCodeVerification,
  forgotPasswordRequest,
  clearCodeVerification,
  clearForgotPasswordRequest
 } from './actionCreators';

import styles from './styles.css';

const ButtonContainer = styled.div`
  padding: 5%;
`;

const LoginContainer = styled.div`
    background: #fff;
    margin: 2em auto;
    box-shadow: 0px 0px 25px 4px #ddd;
    borderRadius: '5%';
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 5%;
    overflow-x: auto;

    @media (min-width: 1280px) {
        width: 30%;
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

/**
  Login/Registration authentication form 
*/

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authScreen: 'login',
      forgotPassword: false,
      verification: false,
    }
    this.props.history.push('/');
  }

  handleChange = (authScreen) => {
    this.setState({
      authScreen,
    });
  }

  setForgotPassword = (value) => {
    this.props.clearForgotPasswordRequest();
    this.setState({
      forgotPassword: value
    });
  }

  setVerification = (value) => {
    this.setState({
      verification: value
    });
  }

  displayErrorMessage = ({message}) => {
    const {authScreen} = this.state;
    return (
      <div className={"error-message"}>
        {message}
        {
          ( message === USER_NOT_VERIFIED || message === USER_ALREADY_EXIST ) &&
          <ButtonContainer>
            <RaisedButton
              primary
              style={{margin: '6% 0'}}
              label={
                this.props.inProgress? 'Please wait...' :
                (message === USER_NOT_VERIFIED ? 'Send Code' : 'Login')
              }
              onClick={() => {
                  message === USER_NOT_VERIFIED ?
                  this.props.requestCodeVerification(authScreen) :
                  this.setState({authScreen: 'login'});
                }
              }
            />
          </ButtonContainer>
        }
      </div>
    );
  }

  renderForgotPassword = ({inProgress}) => (
    <ForgotPassword
      onSubmit={() => (this.props.forgotPasswordRequest(this.props.passwordRequested))}
      cancelAction={() => this.setForgotPassword(false)}
      inProgress={inProgress}
      passwordRequested={this.props.passwordRequested}
      />
  );

  renderVerificationForm = () => (
    <VerificationForm
      onSubmit={() => { this.props.attemptLogin(this.state.authScreen, true) }}
      cancelAction={this.props.clearCodeVerification}
    />
  );

  renderLoginForm = ({inProgress}) => (
    <LoginForm
      inProgress={inProgress}
      forgotPassword={this.setForgotPassword}
      onSubmit={() => { this.props.attemptLogin(this.state.authScreen, false) }}
    />
  )

  renderRegistrationForm = ({inProgress}) => (
    <RegisterForm
      inProgress={inProgress}
      onSubmit={() => {
        this.props.attemptLogin(this.state.authScreen, false)
      }}
    />
  )

  renderForm = ({inProgress}) => {
    const {forgotPassword, authScreen} = this.state;
    return (
      forgotPassword?
      this.renderForgotPassword({inProgress}) :
      (
        this.props.verifyUser ?
        this.renderVerificationForm() :
        (authScreen === 'login' ?
         this.renderLoginForm({inProgress}) :
         this.renderRegistrationForm({inProgress}))
      )
    );
  }

  render() {
    const {authScreen} = this.state;
    const {message, type} = this.props.authError;
    const inProgress = (message === USER_NOT_VERIFIED ||
      message === USER_ALREADY_EXIST)? false : this.props.inProgress;
    return (
      <React.Fragment>
        <LoginContainer>
          <Tabs value={authScreen} onChange={this.handleChange}>
            <Tab label="Register" value="register" />
            <Tab label="Login" value="login" />
          </Tabs>
          {
            type === authScreen && !(this.props.verifyUser && message === USER_NOT_VERIFIED) &&
            this.displayErrorMessage({message})
          }
          { this.renderForm({inProgress})}
        </LoginContainer>
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  authError: state.auth.authError,
  inProgress: state.auth.inProgress,
  passwordRequested: state.auth.passwordRequested,
  verifyUser: state.auth.verifyUser
});

const mapDispatchToProps = (dispatch) => ({
  attemptLogin: bindActionCreators(attemptLogin, dispatch),
  requestCodeVerification: bindActionCreators(requestCodeVerification, dispatch),
  forgotPasswordRequest: bindActionCreators(forgotPasswordRequest, dispatch),
  clearCodeVerification: bindActionCreators(clearCodeVerification, dispatch),
  clearForgotPasswordRequest: bindActionCreators(clearForgotPasswordRequest, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
