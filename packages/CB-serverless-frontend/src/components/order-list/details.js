import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import isEmpty from 'lodash/isEmpty';

const order = {
  orderStatus: "PAYMENT_PENDING",
  orderId: "BHBM65LT6-20180523",
  userId: "c0886bef-48c9-4ca2-8da6-fea86c70555e",
  orderItems: [
    {
      name: 'Snacks',
      boughtQty: 2,
      price: 120
    },
    {
      name: 'Snacks',
      boughtQty: 2,
      price: 120
    },
    {
      name: 'Snacks',
      boughtQty: 2,
      price: 120
    },
    {
      name: 'Snacks',
      boughtQty: 2,
      price: 120
    },
    {
      name: 'Snacks',
      boughtQty: 2,
      price: 120
    },
  ],
  orderDate: "2018-05-23T05:53:01.900Z",
  orderTotal: 385
};

const List = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 2%;
  overflow: auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
`;

const Item = styled.p`
  color: #686b78;
`;

const ListContainer = styled.div`
  padding-top: 3%;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

// To-do
// Take data from props when api is ready.

class OrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  title = ({label, orderId, onSubmit}) => (
    <TitleContainer>
      <div>
      {orderId}
      </div>
      <RaisedButton
        label={label}
        primary={true}
        buttonStyle={{backgroundColor: '#ecb613'}}
        onClick={onSubmit}
        />
    </TitleContainer>
  );

  render() {
    const {orderItems, orderTotal} = order;
    const {openDialog, closeDialog, openStripePaymentModal, paymentInProgress} = this.props;
    // const {orderItems, orderTotal} = this.props;
    return (
      <Dialog
        open={openDialog}
        onRequestClose={closeDialog}
        title={this.title({
          label: paymentInProgress? 'Please wait...' : `Pay: ${orderTotal}`,
          orderId: `OrderId: ${order.orderId}`,
          onSubmit: openStripePaymentModal
        })}
        autoScrollBodyContent={true}
      >
        <ListContainer>
          {
            orderItems.map(({ name, boughtQty, price }, index) => {
              return (
                <List key={index}>
                  <Section>
                    <Item>{name}</Item>
                    <Item>&nbsp;{`x ${boughtQty}`}&nbsp;</Item>
                  </Section>
                  <div>
                    <p>&#8377;{` ${price}`}&nbsp;</p>
                  </div>
                </List>
              );
            })
          }
          <hr />
          <List>
            <Section>
              <Item>Total</Item>
            </Section>
            <div>
              <p>&#8377;{` ${orderTotal}`}&nbsp;</p>
            </div>
          </List>
        </ListContainer>
      </Dialog>
    );
  }
}


export default OrderDetails;
