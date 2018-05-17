import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import BillReceipt from './BillReceipt';
import { Wrapper } from '../base_components';
import { addToCart } from '../actions/cartActions';
import CartItem from './CartItem';
import API from '../service/cart';

const CartWrapper = Wrapper.extend`
  color: #222;
  background: #f5f5f5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const CartMain = styled.div`
  flex: 7;
  padding: 1em 2em;
  background: #fff;
  height: 100%;
  box-shadow: 0px 0px 10px 1px #eee;  
`;

class CartHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
    };
  }

  componentDidMount() {
    // get data from backend
    // how to get data from backend save it in local and
    // prevent re-renders loop
    API.getCart(123456).then((res) => {
      if (res.data) {
        this.setState({
          cartItems: res.data.Item.cartData,
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  renderCartItems = () => {
    const { cartItems } = this.state;
    if (cartItems && cartItems.length > 0) {
      return cartItems.map(obj => <CartItem id={obj.groceryId} qty={obj.quantity} />);
    }
    return null;
  };

  render() {
    return (
      <CartWrapper>
        <CartMain>
          <h1>My Cart</h1>
          {this.renderCartItems()}
        </CartMain>
        <BillReceipt />
      </CartWrapper>
    );
  }
}

function initMapStateToProps(state) {
  return {
    cartItems: state.cart.cartItems,
    lastCartSync: state.cart.lastCartSync,
  };
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    addToCart,
  }, dispatch);
}

CartHome.propTypes = {
  cartItems: PropTypes.shape([
    {
      groceryId: PropTypes.string,
      quantity: PropTypes.number,
    },
  ]).isRequired,
};


// export default connect(initMapStateToProps, initMapDispatchToProps)(CartHome);
export default CartHome;
