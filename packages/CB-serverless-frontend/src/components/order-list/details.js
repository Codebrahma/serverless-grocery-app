import React from 'react';
import styled from 'styled-components';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import isEmpty from 'lodash/isEmpty';

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

/**
  Modal to show the details of the order.
  Having option to pay for the order, if in Pending state.
*/

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
      {
        !isEmpty(this.props.order) &&
        this.props.order.orderStatus === 'PAYMENT_PENDING' &&
        <RaisedButton
          label={label}
          primary={true}
          buttonStyle={{backgroundColor: '#ecb613'}}
          onClick={onSubmit}
          />
      }
    </TitleContainer>
  );

  renderTotal = ({orderTotal})=> (
    <List>
      <Section>
        <Item>Total</Item>
      </Section>
      <div>
        <p>&#8377;{` ${orderTotal}`}&nbsp;</p>
      </div>
    </List>
  )

  renderListItem = ({index, name, qty, price}) => (
    <List key={index}>
      <Section>
        <Item>{name}</Item>
        <Item>&nbsp;{`x ${qty}`}&nbsp;</Item>
      </Section>
      <div>
        <p>&#8377;{` ${price}`}&nbsp;</p>
      </div>
    </List>
  )

  render() {
    const {openDialog, closeDialog, openStripePaymentModal, paymentInProgress, order} = this.props;
    const {orderItems, orderTotal, orderId} = order;
    return (
      <Dialog
        open={openDialog}
        onRequestClose={closeDialog}
        title={this.title({
          label: paymentInProgress? 'Please wait...' : `Pay: ${orderTotal}`,
          orderId: `OrderId: ${orderId}`,
          onSubmit: openStripePaymentModal
        })}
        autoScrollBodyContent={true}
      >
        <ListContainer>
          {
            !isEmpty(orderItems) && orderItems.map(({ name, qty, price }, index) => (
              this.renderListItem({index, name, qty, price})
            ))
          }
          <hr />
          {this.renderTotal({orderTotal})}
        </ListContainer>
      </Dialog>
    );
  }
}


export default OrderDetails;
