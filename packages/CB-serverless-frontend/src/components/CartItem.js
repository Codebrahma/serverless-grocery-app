import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getGroceryInfo } from '../service/grocery';
import Quantity from '../base_components/Quantity';

const CartItemWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 2em;
  margin-bottom: 1em;
  border-bottom: 1px solid #eee;
`;

const ItemImage = styled.img`
    flex: 0 0 80px;
    width: 80px;
    height: 80px;
    margin: 0 2em;
`;

const ItemTitle = styled.div`
  flex: 0 0 60%;
  text-align: left;
  font-size: 20px;
  margin: 0 1em;
`;


class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    const gorceryId = this.props.id;
    getGroceryInfo(gorceryId).then((res) => {
      if (res.data && res.data.Item) {
        this.setState((s, p) => ({
          data: res.data.Item,
        }));
      }
    }).catch((e) => {
      console.log('eee', e);
    });
  }

  render() {
    const { data } = this.state;
    return (
      <CartItemWrap>
        <ItemImage
          src={data.url}
          alt={data.name}
        />
        <ItemTitle>
          {data.name}
        </ItemTitle>
        <Quantity onChange={() => alert('as')} initialQuantity={this.props.qty} />
      </CartItemWrap>
    );
  }
}

CartItem.propTypes = {
  qty: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

export default CartItem;
