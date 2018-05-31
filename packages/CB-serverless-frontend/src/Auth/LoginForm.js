import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';
import styled from 'styled-components';

const ForgotPassword = styled.div`
  color: #0db9f2;
  font-size: 12px;
  padding: 2%;
  cursor: pointer;
`;

/**
  Login form containing username and password fields
  containing option for forgot password
*/

const validate = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = "Email is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  if (!values.dueDate) {
    errors.dueDate = "Due Date is required";
  }
  return errors;
}

const MyForm = ({ handleSubmit, inProgress, forgotPassword }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="login-input">
        <Field
          name="username"
          component={TextField}
          floatingLabelText="Email"
        />
      </div>
      <div className="login-input">
        <Field
          name="password"
          component={TextField}
          type="password"
          floatingLabelText="Password"
        />
      </div>
      <ForgotPassword onClick={() => forgotPassword(true)}>
        Forgot Password?
      </ForgotPassword>
      <RaisedButton
        type={'submit'}
        secondary
        style={{margin: '6% 0'}}
        buttonStyle={{backgroundColor: '#26acd9'}}
        label={inProgress? 'Please wait...': "Login"}
      />
    </form>
  )
}

MyForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'login',
  validate,
  destroyOnUnmount: false,
})(MyForm);
