/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Wrapper } from '../../base_components/index';
import CartItem from './CartItem';
import { deleteCartItem, fetchCartItems, updateCartItemQty } from '../../actions/cart';
import OrderButton from '../../base_components/OrderButton';
import { cancelOrder } from '../../actions/order';
import { submitPaymentTokenId } from '../../actions/payment';
import {displayPaymentModal} from '../../utils/stripe-payment-modal';

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
  box-shadow: 0 0 10px 1px #eee;
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

const RightSideContent = styled.div`
  margin: 0 1em;
  flex: 2.5;
  color: #333;
`;

const OrderPending = styled.section`
  background: #fff;
  padding: 1em 2em;

  > h3 {
    margin: 1em 0 2em;
  }

  > p {
    margin: 1em 0 3em;
    font-weight: bold;
    color: #888;
    letter-spacing: 0.5px;
  }
`;

const TotalSection = styled.div`
  margin: 2em auto;
  font-size: 1.5em;
  padding: 0 3em;
  text-align: right;
  > span:first-child{
    margin: 0 2em;
  }

`;


class CartHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placingOrder: false,
      requestOpenPaymentModal: false,
      paymentModalOpened: false,
    };
  }

  componentDidMount() {
    this.props.fetchCartItems();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.paymentComplete) {
      this.props.history.push('/order-list');
    }
  }


  onCartItemQtyChange = (id, qty) => {
    this.props.updateCartItemQty(id, qty);
  };

  onCartItemDelete = (id) => {
    this.props.deleteCartItem(id);
  };

  getItemInfo = (groceryId) => {
    const { cartItemsInfo } = this.props;
    if (!_.isNil(cartItemsInfo)) {
      return cartItemsInfo.findIndex(obj => obj.groceryId === groceryId);
    }
    return {};
  };

  doCheckout = () => {
    this.props.history.push('/checkout');
  };

  makeLastPayment = () => {
    const { currentOrder, submitPaymentTokenId } = this.props;
    if (!_.isNil(currentOrder)) {
      displayPaymentModal(
        this.props,
        this.onOpenPaymentModal,
        this.onClosePaymentModal,
        submitPaymentTokenId
      );
    }
  };

  onOpenPaymentModal = () => {
    this.setState({ paymentModalOpened: true, requestOpenPaymentModal: false });
  }

  onClosePaymentModal = () => {
    this.setState({ paymentModalOpened: false });
  }

  cancelLastOrder = () => {
    this.props.cancelOrder();
  };

  renderCartItems = () => {
    const { cartItems, cartItemsInfo } = this.props;
    if (cartItems && cartItems.length > 0 && cartItemsInfo && cartItemsInfo.length > 0) {
      return cartItems.map((obj) => {
        const { groceryId, qty } = obj;
        const info = cartItemsInfo[this.getItemInfo(groceryId)];
        return (
          <CartItem
            key={groceryId}
            id={groceryId}
            qty={qty}
            info={info}
            onQtyChange={_.debounce(this.onCartItemQtyChange, 500)}
            onDelete={this.onCartItemDelete}
          />);
      });
    }
    return (
      <EmptyCart>Nothing in cart.</EmptyCart>
    );
  };

  renderPendingOrderSection = (isPending) => {
    if (isPending) {
      return (
        <RightSideContent>
          <OrderPending>
            <h3> You have a Order with payment pending.</h3>
            <p> What would you like to do?</p>

            <OrderButton
              backgroundColor="#32aef1"
              fullWidth
              disabled={this.props.paymentInProgress}
              title="Make Payment for last order"
              onClick={this.makeLastPayment}
            />

            <OrderButton
              backgroundColor="#ff8780"
              fullWidth
              title="Cancel Last Pending Order"
              onClick={this.cancelLastOrder}
            />
          </OrderPending>
        </RightSideContent>);
    }
    return null;
  };

  render() {
    const { currentOrder, cartItems, cartItemsInfo } = this.props;
    const isAnyOrderPending = !_.isNil(currentOrder) && currentOrder.orderStatus === 'PAYMENT_PENDING';

    return (
      <CartWrapper>
        <CartMain>
          <CartHead>My Cart</CartHead>
          {this.renderCartItems()}

          {
            (cartItems && cartItems.length > 0 && cartItemsInfo && cartItemsInfo.length > 0)
            &&
            <TotalSection>
              <span>Total:</span>
              {cartItemsInfo.reduce((total, cur) => total += cur.price * cur.qty, 0)} &#8377;
            </TotalSection>
          }
          {
            (isAnyOrderPending || (cartItems && cartItems.length > 0))
            &&
            <OrderButton
              overlayStyle={{
                width: '200px',
              }}
              title="Checkout &#10230;"
              disabled={isAnyOrderPending}
              onClick={this.doCheckout}
            />
          }
        </CartMain>
        {
          this.renderPendingOrderSection(isAnyOrderPending)
        }
      </CartWrapper>
    );
  }
}

CartHome.propTypes = {
  fetchCartItems: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  updateCartItemQty: PropTypes.func.isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape({
    groceryId: PropTypes.string,
    quantity: PropTypes.number,
  })).isRequired,
  // orderList: PropTypes.array.isRequired,
  cartItemsInfo: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  currentOrder: PropTypes.object.isRequired,
  paymentInProgress: PropTypes.bool.isRequired,
};


function initMapStateToProps(state) {
  return {
    cartItems: state.cart.cartData || [],
    cartItemsInfo: state.cart.cartItemsInfo || [],
    // orderList: state.order.orderList,
    currentOrder: state.order.currentOrder || {},
    userData: state.auth.userData,
    paymentComplete: state.payment.paymentComplete,
    paymentInProgress: state.payment.paymentInProgress || false,
  };
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCartItems,
    cancelOrder,
    deleteCartItem,
    updateCartItemQty,
    submitPaymentTokenId,
  }, dispatch);
}

export default connect(initMapStateToProps, initMapDispatchToProps)(CartHome);
// export default CartHome;
