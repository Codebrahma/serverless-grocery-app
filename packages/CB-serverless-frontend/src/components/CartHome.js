import React, { Component } from 'react';
import { Wrapper } from '../base_components';
import BillReceipt from './BillReceipt';
import Quantity from '../base_components/Quantity';

const CartWrapper = Wrapper.extend`
  color: #222;
  background: #f5f5f5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

class CartHome extends Component {
  render() {
    return (
      <CartWrapper>
        <div
          style={{
            flex: 7,
            padding: '1em 2em',
            background: '#fff',
            height: '100%',
          }}
        >
          <h1>My Cart</h1>
          <div>
            <img src="http://sajkdhkasd.com" />
            <div>
              title
            </div>
            <Quantity onChange={() => alert('as')} />
          </div>
        </div>
        <BillReceipt />
      </CartWrapper>
    );
  }
}

CartHome.propTypes = {};

export default CartHome;
