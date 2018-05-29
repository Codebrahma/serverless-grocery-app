import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import OrderDetails from './details';
import { submitPaymentTokenId } from '../../actions/payment';
import {displayPaymentModal} from '../../utils/stripe-payment-modal';
import styles from './styles.css';

import isEmpty from 'lodash/isEmpty';

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
  status: "Pending",
  statusColor: '#ecb613',
  payText: "Pay",
  cssStyle: 'order-pending',
  textColor: '#dfaf20'
};

const completedConfig = {
  status: "Completed",
  statusColor: '#66b34d',
  payText: "Paid",
  cssStyle: 'order-complete',
  textColor: '#69ac53'
};

const canceledConfig = {
  status: "Canceled",
  statusColor: '#e64d19',
  payText: "Amount",
  cssStyle: 'order-canceled',
  textColor: '#df5020'
}

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
    if (this.props.paymentInProgress && !nextProps.paymentInProgress) {
      this.closeDialog();
    }
  }

  onSelect = (selectedOrder) => {
    const {orderTotal, orderItems} = selectedOrder
    this.setState({
      orderItems,
      orderTotal,
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

  render() {
    let {orderList, orderListFetched} = this.props;
    if (!orderListFetched) {
      return null;
    }
    orderList[0].orderStatus = 'Complete';
    return (
      <div>
      {
        orderList.length === 0?
        <NoOrder>
          There is no order placed yet.
        </NoOrder>:
        <div>
        {
          orderList.map(({orderId, orderStatus, orderTotal, orderDate}, index) => {
            const timeStamp = (new Date(orderDate)).getTime();
            const timeDifference = new Date((Date.now() - timeStamp)).getUTCMinutes();
            const {
              status,
              statusColor,
              payText,
              cssStyle,
              textColor
            } = (orderStatus === 'PAYMENT_PENDING'? pendingConfig : (
              orderStatus === 'CANCELLED'? canceledConfig : completedConfig));
            return (
              <Card key={index}>
              {
                timeDifference < 5 &&
                <div className={`ribbon ${cssStyle} ribbon-top-right`}>
                  <span style={{backgroundColor: statusColor}}>NEW</span>
                </div>
              }
                <Content>
                  <div
                    onClick={() => this.onSelect(orderId)}
                    style={{
                      cursor: 'pointer',
                      color: textColor,
                      marginBottom: '2%'
                    }}>
                    {`OrderId: ${orderId}`}
                  </div>
                  {
                    status === "Completed" ?
                    <IconContainer>
                      <Icon className="material-icons">done</Icon>
                    </IconContainer> :
                    <div style={{color: statusColor}}>
                      {status}

                    </div>
                  }
                </Content>
                {
                  orderStatus === 'PAYMENT_PENDING' ?
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
                  </ButtonContainer> :
                  <AmountContainer style={{color: textColor,}}>
                    {payText}: &#8377;{` ${orderTotal}`}
                  </AmountContainer>
                }
              </Card>
            );
          })
        }
        </div>
      }
        <OrderDetails
          orderItems={this.state.selectedOrder}
          orderTotal={this.state.orderTotal}
          openDialog={this.state.openDialog}
          closeDialog={this.closeDialog}
          openStripePaymentModal={this.openStripePaymentModal}
          paymentInProgress={this.props.paymentInProgress}
          />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orderList: state.order.orderList,
  orderListFetched: state.order.orderListFetched,
  currentOrder: state.order.currentOrder,
  userData: state.auth.userData,
  paymentComplete: state.payment.paymentComplete,
  paymentInProgress: state.payment.paymentInProgress,
});

function initMapDispatchToProps(dispatch) {
  return bindActionCreators({
    submitPaymentTokenId
  }, dispatch);
}

export default connect(mapStateToProps, initMapDispatchToProps)(OrderList);
