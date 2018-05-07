import Profile from './Forms/profile';

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import { bindActionCreators } from 'redux';

import AuthModule from './Auth';
import TodoModule from './Todo';
import { updateAuth } from './Auth/actionCreators';
import { submitTodo, fetchInitial } from './Todo/actionCreators';
import { getInitialTodos, getTodoFormValues } from './Todo/selector';

class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  async componentDidMount() {
    
    if (!this.props.isAuthenticatedFromLogin) {
      try {
        this.props.updateAuth({
          isAuthenticating: false,
          isAuthenticated: false,
          identityId: null,
        })
        if (await Auth.currentSession()) {
          const data = await Auth.currentCredentials();
          this.props.updateAuth({
            isAuthenticating: false,
            isAuthenticated: true,
            identityId: data.params.IdentityId,
          })
        }
      } catch (e) {

      }
    }
  }

  resetInitialState = () => {
    this.props.updateAuth({
      isAuthenticating: false,
      isAuthenticated: false,
      identityId: null,
    });
  }

  render() {
    const {
      isAuthenticated,
      isAuthenticating,
      identityId,
    } = this.props;
  
    return (
      <Router>
         <Route path="/profile" component={Profile} />

        {
          /*
            <div className="root-container">
            {
              isAuthenticating && (
                <CircularProgress
                  size={80}
                  thickness={5}
                />
              )
            }
            {
              (!isAuthenticating && isAuthenticated) ? (
                <Route
                  render={() => (
                    <TodoModule
                      identityId={identityId} 
                      resetInitialState={this.resetInitialState}
                      submitTodo={this.props.submitTodo}
                      fetchInitial={this.props.fetchInitial}
                      initialTodos={this.props.initialTodos}
                      currentTodoFormValues={this.props.currentTodoFormValues}
                      todosFetchStatus={this.props.todosFetchStatus}
                    />
                  )}
                /> 
              ) : (
                !isAuthenticating && <Route render = {() => (
                  <AuthModule
                    errorMessage={this.props.errorMessage}
                  />
                )} />
              )
            }
            {this.props.isError && this.props.errorMessage}
          </div>
          */ 
        }
        
      </Router>
    )
  }

}

const mapStateToProps = state => ({
  isAuthenticating: state.auth.isAuthenticating,
  isAuthenticated: state.auth.isAuthenticated,
  isError: state.auth.isError,
  errorMessage: state.auth.errorMessage,
  identityId: state.auth.identityId,
  initialTodos: getInitialTodos(state),
  todosFetchStatus: {
    isFetching: state.todos.isFetching,
    isFetched: state.todos.isFetched,
  },
  currentTodoFormValues: getTodoFormValues(state),
});

const mapDispatchToProps = dispatch => ({
  updateAuth: bindActionCreators(updateAuth, dispatch),
  submitTodo: bindActionCreators(submitTodo, dispatch),
  fetchInitial: bindActionCreators(fetchInitial, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);








