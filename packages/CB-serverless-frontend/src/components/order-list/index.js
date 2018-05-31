import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import OrderDetails from './details';
import { submitPaymentTokenId, clearPayment } from '../../actions/payment';
import {displayPaymentModal} from '../../utils/stripe-payment-modal';
import styles from './styles.css';
import {orderListSelector} from '../../selectors/order-list';

import sortBy from 'lodash/sortBy';

const NoOrder = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: relative;
  max-width: 700px;
  width: 90%;
  height: 100px;
  background: #fff;
  box-shadow: 0 0 15px rgba(0,0,0,.1);
  margin: 2% auto;
  padding: 1% 2%;
  border: 1px solid #E3DFDE;
  color: '#393736';
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const IconContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #66b34d;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AmountContainer = styled.div`
  padding-top: 2%;
  text-align: left;
`;

const ButtonContainer = styled.div`
  text-align: left;
`;

const Icon = styled.i`
  font-size: 20px;
  color: white;
`;

const pendingConfig = {
  statusText: "Pending",
  statusColor: '#ecb613',
  payText: "Pay",
  cssStyle: 'order-pending',
  textColor: '#dfaf20'
};

const completedConfig = {
  statusText: "Completed",
  statusColor: '#66b34d',
  payText: "Paid",
  cssStyle: 'order-complete',
  textColor: '#69ac53'
};

const canceledConfig = {
  statusText: "Canceled",
  statusColor: '#e64d19',
  payText: "Amount",
  cssStyle: 'order-canceled',
  textColor: '#df5020'
}

/**
  List of all the order placed, canceled or pending.
  On click orderId, open the modal to show details of that order.
  Option for payment if order is in Pending state.   
*/

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrder: {},
      openDialog: false,
      orderTotal: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.paymentComplete) {
      this.closeDialog();
      nextProps.clearPayment();
    }
  }

  onSelect = (selectedOrder) => {
    this.setState({
      selectedOrder,
      openDialog: true
    });
  }

  closeDialog = () => {
    this.setState({
      selectedOrder: {},
      openDialog: false
    });
  }

  onClosePaymentModal = () => {
    this.props.history.push('/order-list');
  }

  openStripePaymentModal = () => {
    displayPaymentModal(
      this.props,
      null,
      this.onClosePaymentModal,
      this.props.submitPaymentTokenId
    )
  }

  renderNoOrder = () => (
    <NoOrder>
      There is no order placed yet.
    </NoOrder>
  )

  renderRibbon = ({cssStyle, statusColor}) => (
    <div className={`ribbon ${cssStyle} ribbon-top-right`}>
      <span style={{backgroundColor: statusColor}}>NEW</span>
    </div>
  )

  renderContent = ({orderId, orderTotal, orderItems, orderStatus, statusText, textColor, statusColor}) => (
    <Content>
      <div
        onClick={() => this.onSelect({orderId, orderTotal, orderItems, orderStatus})}
        style={{
          cursor: 'pointer',
          color: textColor,
          marginBottom: '2%'
        }}>
        {`OrderId: ${orderId}`}
      </div>
      {
        statusText === "Completed" ?
        <IconContainer>
          <Icon className="material-icons">done</Icon>
        </IconContainer> :
        <div style={{color: statusColor}}>
          {statusText}
        </div>
      }
    </Content>
  );

  renderButton = ({payText, orderTotal}) => (
    <ButtonContainer>
      <RaisedButton
        label={
          this.props.paymentInProgress?
          'Please wait...' :
          `${payText}: ${orderTotal}`
        }
        primary={true}
        buttonStyle={{backgroundColor: '#ecb613'}}
        onClick={this.openStripePaymentModal}
        />
    </ButtonContainer>
  );

  renderAmountText = ({textColor, orderTotal, payText}) => (
    <AmountContainer style={{color: textColor,}}>
      {payText}: &#8377;{` ${orderTotal}`}
    </AmountContainer>
  )

  renderOrderCard = ({orderId, orderItems, orderStatus, orderTotal, orderDate}, index) => {
    const timeStamp = (new Date(orderDate)).getTime();
    const inMinutes = (Date.now() - timeStamp) / (60000);
    const {
      statusText,
      statusColor,
      payText,
      cssStyle,
      textColor
    } = (orderStatus === 'PAYMENT_PENDING'? pendingConfig : (
      orderStatus === 'CANCELLED'? canceledConfig : completedConfig));
    return (
      <Card key={index}>
        { inMinutes < 5 && this.renderRibbon({cssStyle, statusColor}) }
        {this.renderContent({orderId, orderTotal, orderItems, orderStatus, textColor, statusColor, statusText})}
        {
          orderStatus === 'PAYMENT_PENDING' ?
          (this.state.openDialog? null : this.renderButton({payText, orderTotal})) :
          this.renderAmountText({textColor, orderTotal, payText})
        }
      </Card>
    );
  }

  render() {
    let {orderList, orderListFetched, isOrderlistEmpty} = this.props;
    if (!orderListFetched) {
      return null;
    }
    return (
      <div>
      {
        isOrderlistEmpty?
        this.renderNoOrder():
        <div>
        {
          orderList.map((item, index) => {
            return (this.renderOrderCard(item, index));
          })
        }
        </div>
      }
        <OrderDetails
          order={this.state.selectedOrder}
          openDialog={this.state.openDialog}
          closeDialog={this.closeDialog}
          openStripePaymentModal={this.openStripePaymentModal}
          paymentInProgress={this.props.paymentInProgress}
          />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    orderList,
    isOrderlistEmpty,
    orderListFetched,
    orderTotal,
    orderId,
    username,
    paymentInProgress,
    paymentComplete
  } = orderListSelector(state);
  return ({
    orderList,
    isOrderlistEmpty,
    orderListFetched,
    orderTotal,
    orderId,
    username,
    paymentInProgress,
    paymentComplete
  });
}

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    submitPaymentTokenId,
    clearPayment
  }, dispatch);
}

export default connect(mapStateToProps, initMapDispatchToProps)(OrderList);
