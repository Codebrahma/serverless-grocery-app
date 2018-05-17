import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { pinkA200 } from 'material-ui/styles/colors';

const BillingList = styled.ul`
position: relative;
  padding: 1em 2em 3em;
  border: 1px solid #eee;
  box-shadow: 0px 0px 5px -1px #ddd;

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
    transform: translateY(100%);
  }
`;

const BillingItem = styled.li`
  padding: 1em 1em 1em 0;
  border-bottom: 2px dotted #eee;
  position: relative;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ItemText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  order: 1;
  flex: 0 0 60%;
`;

const QuantText = styled.span`
  font-weight: bold; 
  margin: 0 auto;
  color: #8f8f8f;  
  order: 2;
`;

const AmountText = styled.span`
  font-weight: bold; 
  order: 3;
`;

const TotalAmount = AmountText.extend`
  font-weight: bold;
  font-size: 24px;
  color: ${pinkA200}
`;

class CartHome extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div
          style={{
            flex: 7,
            background: '#eee',
            height: '100%'
          }}>
          Content
        </div>
        <div
          style={{
            margin: '0 10px',
            flex: 2,
            padding: '1em',
            background: '#fff',
          }}>
          <h1>Side</h1>
          <BillingList>
            <h2>Cart Items</h2>
            <BillingItem>
              <ItemText>Treasure, ha Billing Itemtosis, and love.</ItemText>
              <QuantText>&#215; 3</QuantText>
              <AmountText> 500 &#8377;</AmountText>
            </BillingItem>
            <BillingItem>
              <ItemText>Grow impatiently like a golden pirate.</ItemText>
              <QuantText>&#215; 1</QuantText>
              <AmountText> 500 &#8377;</AmountText>
            </BillingItem>
            <BillingItem>
              <ItemText>All bilge rats fear addled, shiny bucaneers.</ItemText>
              <QuantText>&#215; 1</QuantText>
              <AmountText> 500 &#8377;</AmountText>
            </BillingItem>
            <BillingItem>
              <ItemText>Damn yer sun, feed the moon.</ItemText>
              <QuantText>&#215; 2</QuantText>
              <AmountText> 500 &#8377;</AmountText>
            </BillingItem>
            <BillingItem>
              <ItemText>Damn yer scallywag, feed the dubloon.</ItemText>
              <QuantText>&#215; 1</QuantText>
              <AmountText> 500 &#8377;</AmountText>
            </BillingItem>
          </BillingList>
          <div
            style={{
              background: '#ddd',
              padding: '3em 2em 2em',
              marginTop: '-1em'
            }}>
            <BillingItem>
              <ItemText>Total:</ItemText>
              <TotalAmount> 500 &#8377;</TotalAmount>
            </BillingItem>
          </div>
        </div>
      </div>
    );
  }
}

CartHome.propTypes = {};

export default CartHome;
