import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import _ from 'lodash';

import BillReceipt from './BillReceipt';
import { Wrapper } from '../../base_components/index';
import CartItem from './CartItem';
import { deleteCartItem, fetchCartItems, saveItemInfoToCart, updateCartItemQty } from '../../actions/cart';

const CartWrapper = Wrapper.extend`
  color: #222;
  background: #f5f5f5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
`;

const CartMain = styled.div`
  flex: 7;
  padding: 3em 2em;
  background: #fff;
  box-shadow: 0px 0px 10px 1px #eee;  
`;

const EmptyCart = styled.div`
  padding: 2em;
  font-size: 20px;
  text-align: center;
  color: #888;
  background: #eee;
  margin: 4em auto 1em;
`;

const CartHead = styled.h1`
  border-bottom: 1px solid #eee;
  padding-bottom: 1em;
`;

class CartHome extends Component {
  constructor(props) {
    super(props);
    this.cartItemsInfo = [];
  }

  componentDidMount() {
    // get data from backend
    // how to get data from backend save it in local and
    // prevent re-renders loop
    this.props.fetchCartItems();
  }

  onCartItemQtyChange = (id, qty) => {
    this.props.updateCartItemQty(id, qty);
  };

  onCartItemDelete = (id) => {
    this.props.deleteCartItem(id);
  };

  onItemDataReceived = (data, boughtQty) => {
    this.props.saveItemInfoToCart(data.Item, boughtQty);
  };


  renderCartItems = () => {
    const { cartItems } = this.props;
    if (cartItems && cartItems.length > 0) {
      return cartItems.map((obj) => {
        const { groceryId, qty } = obj;
        return (
          <CartItem
            key={groceryId}
            id={groceryId}
            qty={qty}
            onQtyChange={_.debounce(this.onCartItemQtyChange, 500)}
            onDelete={this.onCartItemDelete}
            onDataReceived={this.onItemDataReceived}
          />);
      });
    }
    return (
      <EmptyCart>Nothing in cart.</EmptyCart>
    );
  };

  render() {
    return (
      <CartWrapper>
        <CartMain>
          <CartHead>My Cart</CartHead>
          {this.renderCartItems()}
        </CartMain>
        <BillReceipt cartItems={this.cartItemsInfo} />
      </CartWrapper>
    );
  }
}

function initMapStateToProps(state) {
  return {
    cartItems: state.cart.cartData,
  };
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCartItems,
    deleteCartItem,
    updateCartItemQty,
    saveItemInfoToCart,
  }, dispatch);
}

CartHome.propTypes = {
  fetchCartItems: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
  updateCartItemQty: PropTypes.func.isRequired,
  saveItemInfoToCart: PropTypes.func.isRequired,
  cartItems: PropTypes.shape([
    {
      groceryId: PropTypes.string,
      quantity: PropTypes.number,
    },
  ]).isRequired,
};


export default connect(initMapStateToProps, initMapDispatchToProps)(CartHome);
// export default CartHome;
