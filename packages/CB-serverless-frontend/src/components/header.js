import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { FlatButton } from 'material-ui';
import { Auth } from 'aws-amplify';
import AppBar from 'material-ui/AppBar';
import { updateAuth } from '../Auth/actionCreators';

const AppHeader = styled(AppBar)`
  position: fixed;
  top: 0;
`;

const RightElementContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ShoppingCartIcon = styled.i`
  font-size: 36px;
  color: white;
  margin-right: 5%;
`;

const LogoutButton = styled(FlatButton)`
  color: white !important;
`;

const CartItemsCount = styled.div`
  align-items: center;
  background-color: white;
  border-radius: 15px;
  display: flex;
  font-size: 12px;
  height: 20px;
  justify-content: center;
  position: relative;
  right: 40%;
  top: -10px;
  width: 30px;
`;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    await Auth.signOut();
    this.resetInitialState();
  }

  resetInitialState = () => {
    this.props.updateAuth({
      isAuthenticating: false,
      isAuthenticated: false,
      identityId: null,
      userData: null
    });
  }

  render() {
    return (
      <AppHeader
        title={<span>Serverless Shopping App</span>}
        iconStyleRight={{marginTop: '1%'}}
        iconElementRight={
          <RightElementContainer>
            <ShoppingCartIcon className="material-icons">add_shopping_cart</ShoppingCartIcon>
            {
              // Logic should be changed after getting cartItem count
              false? <CartItemsCount>{2}</CartItemsCount> : null
            }
            <LogoutButton label="logout" onClick={this.handleLogout} />
          </RightElementContainer>
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticating: state.auth.isAuthenticating,
  isAuthenticated: state.auth.isAuthenticated,
  identityId: state.auth.identityId,
  userData: state.auth.userData,
});

const mapDispatchToProps = dispatch => ({
  updateAuth: bindActionCreators(updateAuth, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
