import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';

/**
  Registration form containing FullName, Email, Password, PhoneNumber fields.
*/

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Name is required";
  }
  if (!values.lastname) {
    errors.lastname = "Last Name is required";
  }
  if (!values.username) {
    errors.username = "Email is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  if (!values.phone) {
    errors.phone = "Phone number is required";
  }

  return errors;
}

const MyForm = ({ handleSubmit, inProgress }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="login-input">
        <Field
          name="name"
          component={TextField}
          floatingLabelText="Name"
        />
      </div>
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
      <div className="login-input">
        <Field
          name="phone"
          component={TextField}
          floatingLabelText="Phone Number"
        />
      </div>
      <RaisedButton
        type={'submit'}
        secondary
        buttonStyle={{backgroundColor: '#26acd9'}}
        style={{margin: '6% 0'}}
        label={inProgress? 'Please wait...': "Register"}
      />
    </form>
  )
}

MyForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'register',
  validate,
  destroyOnUnmount: false,
})(MyForm);
