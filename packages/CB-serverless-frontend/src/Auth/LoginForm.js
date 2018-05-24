import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';

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

const MyForm = ({ handleSubmit, type, shouldDisableLogin }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="login-input">
        <Field
          name="username"
          component={TextField}
          floatingLabelText="Email"
          disabled={shouldDisableLogin}
        />
      </div>
      <div className="login-input">
        <Field
          name="password"
          component={TextField}
          type="password"
          floatingLabelText="Password"
          disabled={shouldDisableLogin}
        />
      </div>
      <RaisedButton
        secondary
        type={type}
        style={{margin: '6% 0'}}
        label="Login"
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
