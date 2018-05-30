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
import { cartHomeSelector } from '../../selectors/cart-home';

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
    const { cartItemsInfo, isCartItemsInfoEmpty } = this.props;
    if (!isCartItemsInfoEmpty) {
      return cartItemsInfo.findIndex(obj => obj.groceryId === groceryId);
    }
    return {};
  };

  doCheckout = () => {
    this.props.history.push('/checkout');
  };

  makeLastPayment = () => {
    const { isCurrentOrderEmpty, submitPaymentTokenId } = this.props;
    if (!isCurrentOrderEmpty) {
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
    const { cartItems, cartItemsInfo, isCartItemsInfoEmpty, isCartItemsEmpty } = this.props;
    if (!isCartItemsEmpty && !isCartItemsInfoEmpty) {
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
    const { orderStatus, isCurrentOrderEmpty, cartItems, cartItemsInfo, totalBill, isCartItemsEmpty, isCartItemsInfoEmpty } = this.props;
    const isAnyOrderPending = !isCurrentOrderEmpty && orderStatus === 'PAYMENT_PENDING';
    // TODO: Write Comments for conditional cases
    return (
      <CartWrapper>
        <CartMain>
          <CartHead>My Cart</CartHead>
          {this.renderCartItems()}

          {
            (!isCartItemsEmpty && !isCartItemsInfoEmpty)
            &&
            <TotalSection>
              <span>Total:</span>
              {totalBill} &#8377;
            </TotalSection>
          }
          {
            (isAnyOrderPending || (!isCartItemsEmpty))
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
  isCurrentOrderEmpty: PropTypes.bool.isRequired,
  orderTotal: PropTypes.number,
  orderStatus: PropTypes.string,
  orderId: PropTypes.string,
  username: PropTypes.string.isRequired,
  isCartItemsInfoEmpty: PropTypes.bool.isRequired,
  cartItemsInfo: PropTypes.array.isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape({
    groceryId: PropTypes.string,
    quantity: PropTypes.number,
  })).isRequired,
  totalBill: PropTypes.number.isRequired,
  isCartItemsEmpty: PropTypes.bool.isRequired,
  fetchCartItems: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  updateCartItemQty: PropTypes.func.isRequired,
  paymentInProgress: PropTypes.bool.isRequired,
  paymentComplete: PropTypes.bool,
};


function initMapStateToProps(state) {
  const {
    isCurrentOrderEmpty,
    orderTotal,
    orderStatus,
    orderId,
    username,
    isCartItemsInfoEmpty,
    cartItemsInfo,
    cartItems,
    totalBill,
    isCartItemsEmpty,
    paymentInProgress,
    paymentComplete
  } = cartHomeSelector(state);
  return {
    isCurrentOrderEmpty,
    orderTotal,
    orderStatus,
    orderId,
    username,
    isCartItemsInfoEmpty,
    cartItemsInfo,
    cartItems,
    totalBill,
    isCartItemsEmpty,
    paymentInProgress,
    paymentComplete,
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
