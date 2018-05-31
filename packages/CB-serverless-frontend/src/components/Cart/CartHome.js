/* eslint-disable react/forbid-prop-types,react/no-unused-state,react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import CartItem from './CartItem';
import { deleteCartItem, fetchCartItems, updateCartItemQty } from '../../actions/cart';
import OrderButton from '../../base_components/OrderButton';
import { cancelOrder } from '../../actions/order';
import { submitPaymentTokenId as submitPaymentTokenIdAction, clearPayment } from '../../actions/payment';
import { displayPaymentModal } from '../../utils/stripe-payment-modal';
import { cartHomeSelector } from '../../selectors/cart-home';
import CircularProgress from 'material-ui/CircularProgress';
import {
  CartHead,
  CartMain,
  CartWrapper,
  EmptyCart,
  OrderPending,
  RightSideContent,
  TotalSection,
} from './styles/components';

/**
  Display cart Items details and option to makepayment or cancel order if it is
  pending, otherwise option to checkout.
*/

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
      nextProps.clearPayment();
      this.props.history.push('/order-list');
    }
  }


  onCartItemQtyChange = (id, qty) => {
    this.props.updateCartItemQty(id, qty);
  };

  onCartItemDelete = (id) => {
    this.props.deleteCartItem(id);
  };

  onOpenPaymentModal = () => {
    this.setState({ paymentModalOpened: true, requestOpenPaymentModal: false });
  };

  onClosePaymentModal = () => {
    this.setState({ paymentModalOpened: false });
  };

  getItemInfo = (groceryId) => {
    const { cartItemsInfo, isCartItemsInfoEmpty } = this.props;
    if (!isCartItemsInfoEmpty) {
      return cartItemsInfo.findIndex(obj => obj.groceryId === groceryId);
    }
    return {};
  };

  makeLastPayment = () => {
    const { isCurrentOrderEmpty, submitPaymentTokenId } = this.props;
    if (!isCurrentOrderEmpty) {
      displayPaymentModal(
        this.props,
        this.onOpenPaymentModal,
        this.onClosePaymentModal,
        submitPaymentTokenId,
      );
    }
  };

  doCheckout = () => {
    this.props.history.push('/checkout');
  };

  cancelLastOrder = () => {
    this.props.cancelOrder();
  };

  renderCartItems = () => {
    const {
      cartItems, cartItemsInfo, isCartItemsInfoEmpty, isCartItemsEmpty, fetchingCart
    } = this.props;
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
    if (fetchingCart) {
      return (
        <CircularProgress size={60} thickness={7} style={{paddingTop: '5%'}}/>
      );
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

  renderCartTotalSection = () => {
    const { totalBill, isCartItemsEmpty, isCartItemsInfoEmpty } = this.props;

    if (!isCartItemsEmpty && !isCartItemsInfoEmpty) {
      return (
        <TotalSection>
          <span>Total:</span>
          {totalBill} &#8377;
        </TotalSection>);
    }
    return null;
  };

  render() {
    const {
      orderStatus, isCurrentOrderEmpty,
      isCartItemsEmpty,
    } = this.props;
    const isAnyOrderPending = !isCurrentOrderEmpty && orderStatus === 'PAYMENT_PENDING';
    return (
      <CartWrapper>
        <CartMain>
          <CartHead>My Cart</CartHead>
          {this.renderCartItems()}

          {
            this.renderCartTotalSection()
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
  submitPaymentTokenId: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  updateCartItemQty: PropTypes.func.isRequired,
  paymentInProgress: PropTypes.bool.isRequired,
  paymentComplete: PropTypes.bool,
  fetchingCart: PropTypes.bool,
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
    paymentComplete,
    fetchingCart
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
    fetchingCart
  };
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCartItems,
    cancelOrder,
    deleteCartItem,
    updateCartItemQty,
    clearPayment,
    submitPaymentTokenId: submitPaymentTokenIdAction,
  }, dispatch);
}

export default connect(initMapStateToProps, initMapDispatchToProps)(CartHome);
