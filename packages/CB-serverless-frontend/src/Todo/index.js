import React from 'react';

import { connect } from 'react-redux';
import TodoForm from './TodoForm';
import { FlatButton } from 'material-ui';
import { Auth, API } from 'aws-amplify';
import AppBar from 'material-ui/AppBar';


class Todo extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  async componentDidMount() {
    this.props.fetchInitial();
  }

  async handleLogout() {
    await Auth.signOut();
    this.props.resetInitialState();
  }

  render() {
    return (
      <div>
        <AppBar
          title={<span>Serverless Todo App</span>}
          iconElementRight={<FlatButton label="logout" onClick={this.handleLogout} />}
        />
        <TodoForm
          currentValue={this.props.currentValue}
          identityId={this.props.identityId}
          submitTodo={this.props.submitTodo}
          initialTodos={this.props.initialTodos}
          initialValues={this.props.initialTodos}
          currentTodoFormValues={this.props.currentTodoFormValues}
          todosFetchStatus={this.props.todosFetchStatus}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentValue: (state.form.todoForm && state.form.todoForm.values) ? state.form.todoForm.values.todo : [],
});


export default connect(mapStateToProps, () => ({}))(Todo);