import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';


import { FlatButton, FontIcon, IconButton } from 'material-ui';
import { Auth } from 'aws-amplify';
import AppBar from 'material-ui/AppBar';
import { updateAuth } from '../Auth/actionCreators';

const AppHeader = styled(AppBar)`
  position: fixed;
  top: 0;
`;

const RightElementContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
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
    });
  };

  render() {
    return (
      <AppHeader
        title={<span>Serverless Shopping App</span>}
        iconElementRight={
          <RightElementContainer>
            <Link
              to="/cart"
              href="/cart"
            >
              <IconButton
                iconStyle={{
                color: '#fff',
                fontSize: 28,
              }}
                iconClassName="material-icons"
              >add_shopping_cart
              </IconButton>
              {
              // Logic should be changed after getting cartItem count
              false ? <CartItemsCount>{2}</CartItemsCount> : null
            }
            </Link>
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
});

const mapDispatchToProps = dispatch => ({
  updateAuth: bindActionCreators(updateAuth, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
