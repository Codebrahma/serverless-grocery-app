import React from 'react';

import { reduxForm, Field } from 'redux-form';
import { 
  TextField,
  DatePicker,
} from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = "Title is required";
  }
  if (!values.description) {
    errors.description = "Description is required";
  }
  if (!values.dueDate) {
    errors.dueDate = "Due Date is required";
  }

  return errors;
}

const AddNewTodo = ({ handleClose, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-input">
      <Field
        name="title"
        floatingLabelText="Title"
        component={TextField}
      />
    </div>
    <div className="form-input">
      <Field
        name="description" 
        floatingLabelText="Description"
        component={TextField}
      />
    </div>
    <div className="form-input">
      <Field
        name="dueDate"
        component={DatePicker}
        hintText="Due Date ?"
      />
    </div>
    <RaisedButton
      type="submit"
      label="Submit"
    />
  </form>
);

export default reduxForm({
  form: 'addTodo',
  validate,
})(AddNewTodo);