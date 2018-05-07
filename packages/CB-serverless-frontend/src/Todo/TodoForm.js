import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, change } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { RaisedButton } from 'material-ui';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import moment from 'moment';
import CircularProgress from 'material-ui/CircularProgress';

import Dialog from 'material-ui/Dialog';
import TodoCard from './TodoCard';
import AddNewTodo from './AddNewTodo';

import styles from './styles.css';

class MyForm extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      editableIndex: -1,
      addNewTodoScreenVisible: false,
    }
  }

  onChangeTodoVisiblity = (addNewTodoScreenVisible) => {
    this.setState({
      addNewTodoScreenVisible,
    })
  }

  handleEdit = (editableIndex) => {
    return () => {
      console.log('editable index', editableIndex);
      this.setState(() => ({
        editableIndex,
        addNewTodoScreenVisible: true,
      }));
    }
  }

  handleDelete = (index) => {
    return () => {
      this.props.dispatch(change(
        'todoForm',
        `todoList[${index}]`,
        {
          ...this.props.currentTodoFormValues[index],
          active: false,
        },
      ));
    }
  }

  handleAddTodoSubmit = (oldValue) => {
    const values = {
      ...oldValue,
      dueDate: moment(oldValue.dueDate).toDate(),
      active: true,
    };
    
    if (this.state.editableIndex !== -1) {
      this.props.dispatch(change(
        'todoForm',
        `todoList[${this.state.editableIndex}]`,
        values,
      ));
      this.setState(prevState => ({
        editableIndex: -1,
      }));
    } else {
      const currentTodoFormValues = this.props.currentTodoFormValues;
      currentTodoFormValues.push({ ...values });
      forEach(currentTodoFormValues, (index) => {
        this.props.dispatch(change(
          'todoForm',
          `todoList[${index}]`,
          currentTodoFormValues[index],
        ));
      });
  
      this.setState(prevState => ({
        addableIndex: prevState.addableIndex + 1
      }));
    }

    this.onChangeTodoVisiblity(false);
  }
  handleClose = () => {
    this.onChangeTodoVisiblity(false);
  }

  renderAddOrEditForm = () => {
    const initialValues = this.state.editableIndex !== -1 ? this.props.currentTodoFormValues[this.state.editableIndex] : {};
    
    return (
      <Dialog
        open={this.state.addNewTodoScreenVisible}
        onRequestClose={this.handleClose}
      >
        <AddNewTodo 
          onSubmit={this.handleAddTodoSubmit}
          initialValues={initialValues}
        />
      </Dialog>
    );
  }
  render() {
    if (this.props.todosFetchStatus.isFetching) {
      return (
        <CircularProgress
          size={80}
          thickness={5}
        />
      )
    }
    return (
      <div className="todo-container">
        <form onSubmit={this.props.handleSubmit}>
          {
            map(this.props.currentTodoFormValues, (({ title, description, dueDate, active }, index) => {
              if (active) {
                return (
                  <TodoCard 
                    key={index}
                    index={index}
                    title={title}
                    description={description}
                    dueDate={moment(dueDate).format('DD/MM/YYYY')}      
                    handleEdit={this.handleEdit}
                    handleDelete={this.handleDelete}
                  />
                )
              } else {
                return (
                  <div>
                  </div>
                )
              }
            }))
          }

          <RaisedButton 
            label="Add New Todo"
            className="add-todo-button"
            onClick={() => this.onChangeTodoVisiblity(true)}
          />
          <RaisedButton 
            label="Submit Todos"
            className="submit-todo-button"
            primary
            onClick={this.props.submitTodo}
          />
          {this.renderAddOrEditForm()}
        </form>
      </div>
    )
  }
}


MyForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'todoForm',
  enableReinitialize: true,
})(MyForm);