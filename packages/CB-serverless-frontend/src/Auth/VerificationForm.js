import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';
import { ButtonSection, ButtonContainer } from './common/buttons';

/**
  Verification form containing verifiacation-code field.
*/

const validate = (values) => {
  const errors = {};
  if (!values.verification) {
    errors.verification = "Verification code is required";
  }
  return errors;
}

const VerificationForm = ({ handleSubmit, cancelAction, inProgress }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  )
}

VerificationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'verification',
  validate,
  destroyOnUnmount: false,
})(VerificationForm);
