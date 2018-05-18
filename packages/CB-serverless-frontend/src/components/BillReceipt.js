/* eslint-disable react/forbid-prop-types */
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { pinkA200 } from 'material-ui/styles/colors';
import { connect } from 'react-redux';

const BillingList = styled.ul`
  position: relative;
  padding: 3em 2em 4em;
  box-shadow: 0px 0px 5px -1px #ddd;
  transition-delay: 3s;

  &:after{
    background: linear-gradient( -45deg, #3360 32px, white 0) 0 0,linear-gradient(45deg, #22ffdd00 32px, white 16px) 0 0;
    background-position: left bottom;
    background-repeat: repeat-x;
    background-size: 32px 32px;
    content: " ";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    filter: drop-shadow(#ddd 0px 3px 1px);
    height: 32px;
    transform: ${props => (props.isEmpty ? 'translateY(2em)' : 'translateY(1em)')};
  }
`;

const BillingItem = styled.li`
  padding: 1em 1em 1em 0;
  border-bottom: 2px dotted #eee;
  position: relative;
  font-size: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ItemText = styled.span`
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  order: 1;
  flex: 1 1 60%;
`;

const QuantText = styled.span`
  font-weight: normal; 
  margin: 0 auto;
  color: #8f8f8f;  
  order: 2;
  flex: 1 1 10%;

`;

const AmountText = styled.span`
  font-weight: bold; 
  order: 3;
  flex: 1 1 10%;
  text-align: right;
`;

const TotalWrap = styled.div`
    background: #ddd;
    padding: 3em 2em 2em;
    margin-top: -1em; 
    > li {
      justify-content: flex-end;
    }       
`;

const TotalText = ItemText.extend`
  font-size: 24px;
`;

const TotalAmount = AmountText.extend`
  font-weight: bold;
  font-size: 24px;
  color: ${pinkA200}
`;

const BillReceiptWrap = styled.div`
  margin: 0 1em;
  flex: 2;
  color: #333;
  background: #fff;
`;

const ReceiptTitle = styled.h2`
  margin-bottom: 1em;
  padding: 0 1em 1em;
  border-bottom: 1px solid #eee;
`;


const EmptyCart = styled.div`
  padding: 2em;
  font-size: 20px;
  text-align: center;
  color: #888;
  background: #eee;
  margin: 4em auto 0;
`;

class BillReceipt extends PureComponent {
  getTotalAmount = () => this.props.cartItems.reduce((acc, cur) => {
    acc += parseInt(cur.price, 10) * parseInt(cur.boughtQty, 10);
    return acc;
  }, 0);

  render() {
    const { cartItems } = this.props;

    return (
      <BillReceiptWrap>
        <BillingList isEmpty={(!cartItems || cartItems.length === 0)}>
          <ReceiptTitle>My Bill</ReceiptTitle>
          {
            cartItems &&
            cartItems.map(obj => (
              <BillingItem>
                <ItemText>{obj.name}</ItemText>
                <QuantText>&#215; {obj.boughtQty}</QuantText>
                <AmountText> {obj.price} &#8377;</AmountText>
              </BillingItem>))
          }
          {
            (!cartItems || cartItems.length === 0)
            &&
            <EmptyCart>
              Nothing to bill for.
            </EmptyCart>
          }
        </BillingList>
        {
          (cartItems && cartItems.length > 0) &&
          <TotalWrap>
            <BillingItem>
              <TotalText>Total</TotalText>
              <TotalAmount> {this.getTotalAmount()} &#8377;</TotalAmount>
            </BillingItem>
          </TotalWrap>
        }
      </BillReceiptWrap>
    );
  }
}
BillReceipt.defaultProps = {
  cartItems: [],
};

BillReceipt.propTypes = {
  cartItems: PropTypes.array,
};

function initMapStateToProps(state) {
  return {
    cartItems: state.cart.cartItemsInfo,
  };
}

export default connect(initMapStateToProps)(BillReceipt);
