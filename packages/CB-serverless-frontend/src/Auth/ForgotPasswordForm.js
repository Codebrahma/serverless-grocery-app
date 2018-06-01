import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';
import { ButtonSection, ButtonContainer } from './common/buttons';

/**
  ForgotPassword form, to reset the password.
  Submit the username, finally type code and new password.
*/

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "Email is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  if (!values.code) {
    errors.code = "Code is required";
  }
  return errors;
}

const renderNewPasswordInput = () => (
  <React.Fragment>
    <div className="login-input">
      <Field
        name="code"
        component={TextField}
        floatingLabelText="code"
      />
    </div>
    <div className="login-input">
      <Field
        name="password"
        component={TextField}
        type="password"
        floatingLabelText="new password"
      />
    </div>
  </React.Fragment>
);

const renderUsernameInput = () => (
  <div className="login-input">
    <Field
      name="username"
      component={TextField}
      floatingLabelText="Email"
    />
  </div>
);

const renderButtons = ({inProgress, cancelAction}) => (
  <ButtonSection>
    <ButtonContainer>
      <RaisedButton
        secondary
        type={'submit'}
        label={inProgress? 'Please wait...' : 'Submit'}
        buttonStyle={{backgroundColor: '#26acd9'}}
      />
    </ButtonContainer>
    <ButtonContainer>
      <RaisedButton
        secondary
        label={"Cancel"}
        onClick={cancelAction}
      />
    </ButtonContainer>
  </ButtonSection>
);

const ForgotPasswordForm = ({ handleSubmit, inProgress, cancelAction, passwordRequested }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
      {
        passwordRequested ?
        renderNewPasswordInput()
        :
        renderUsernameInput()
      }
      {renderButtons({inProgress, cancelAction})}
      </form>
    </div>
  )
}

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'forgotPassword',
  validate,
  destroyOnUnmount: false,
})(ForgotPasswordForm);
