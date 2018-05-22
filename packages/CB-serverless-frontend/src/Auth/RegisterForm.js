import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';

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

const MyForm = ({ handleSubmit, type, shouldDisableLogin, requireVerification }) => {
  return (
    <form onSubmit={handleSubmit}>
      {
        requireVerification ?
        <React.Fragment>
          <div className="success-note">
            Enter the verification code.
          </div>
          <div className="login-input">
            <Field
              name="verification"
              component={TextField}
              floatingLabelText="Verification Code"
            />
          </div>
        </React.Fragment>
        :
        <React.Fragment>
          <div className="login-input">
            <Field
              name="name"
              component={TextField}
              floatingLabelText="Name"
              disabled={shouldDisableLogin}
            />
          </div>
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
          <div className="login-input">
            <Field
              name="phone"
              component={TextField}
              floatingLabelText="Phone Number"
              disabled={shouldDisableLogin}
            />
          </div>
        </React.Fragment>
      }
      <RaisedButton
        secondary
        type={type}
        style={{margin: '6% 0'}}
        label={requireVerification? "Submit" : "Register"}
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
