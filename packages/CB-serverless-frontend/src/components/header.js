/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { FlatButton, IconButton } from 'material-ui';
import { Auth } from 'aws-amplify';
import AppBar from 'material-ui/AppBar';
import { updateAuth } from '../Auth/actionCreators';
import { fetchCartItems } from '../actions/cart';
import { fetchAllOrders } from '../actions/order';
import { headerSelector } from '../selectors/header'

const AppHeader = styled(AppBar)`
  position: fixed;
  top: 0;
  align-items: flex-start;
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
  font-size: 11px;
  height: 20px;
  justify-content: center;
  position: absolute;
  right:-1em;
  top: 0px;
  color: #000;
  width: 30px;
`;

/**
  Header having home icon, title of the application, cartItems count
  and logout option.
*/

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const {orderListFetched, fetchAllOrders, fetchCartItems} = this.props;
    if (!orderListFetched) {
      fetchAllOrders();
    }
    fetchCartItems();
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
      userData: null,
    });
  };

  renderLeftIcons = () => (
    <Link to="/" href="/">
      <IconButton iconStyle={{color: '#fff'}} iconClassName="material-icons">
        home
      </IconButton>
    </Link>
  )

  renderRightIcons = () => (
    <RightElementContainer>
      <Link
        to="/cart"
        href="/cart"
        style={{
          position: 'relative',
          margin: '0 1em',
        }}>
        <IconButton
          iconStyle={{
            color: '#fff',
            fontSize: 28,
          }}
          iconClassName="material-icons">
          add_shopping_cart
        </IconButton>
        {
          !this.props.isCartDataEmpty? <CartItemsCount>{this.props.cartDataLength}</CartItemsCount> : null
        }
      </Link>
      <Link
        to="/order-list"
        href="/order-list"
        style={{
          position: 'relative',
          color: 'white',
          width: '100px',
        }}>
        Order List
      </Link>
      <LogoutButton label="logout" onClick={this.handleLogout} />
    </RightElementContainer>
  )

  render() {
    return (
      <AppHeader
        title={<span>Serverless Shopping App</span>}
        iconElementLeft={this.renderLeftIcons()}
        iconElementRight={this.renderRightIcons()}
      />
    );
  }
}

Header.propTypes = {
  cartDataLength: PropTypes.number.isRequired,
  isCartDataEmpty: PropTypes.bool.isRequired,
  orderListFetched: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  const {orderListFetched, cartDataLength, isCartDataEmpty} = headerSelector(state);
  return ({
    orderListFetched,
    cartDataLength,
    isCartDataEmpty
  });
};

const mapDispatchToProps = dispatch => ({
  updateAuth: bindActionCreators(updateAuth, dispatch),
  fetchCartItems: bindActionCreators(fetchCartItems, dispatch),
  fetchAllOrders: bindActionCreators(fetchAllOrders, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
