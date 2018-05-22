import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CircularProgress, IconButton } from 'material-ui';


import { getGroceryInfo } from '../../service/grocery';
import Quantity from '../../base_components/Quantity';
import { isEmpty } from 'lodash';

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
  flex: 1 1 60%;
  text-align: left;
  font-size: 20px;
  margin: 0 1em;
`;

const DeleteIconWrap = styled.div`
  flex: 0 0 180px;
  text-align: left;
  font-size: 20px;
  margin: 0 1em;
`;

const SoldOutError = styled.p`
  color: red;
  font-size: 14px;
  margin: 1em auto;
`;

class CartItem extends PureComponent {
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
        }), this.props.onDataReceived(res.data, this.props.qty));
      }
    }).catch((e) => {
      console.log('eee', e);
    });
  }

  render() {
    const { data } = this.state;

    if (isEmpty(data)) {
      return (<CartItemWrap><CircularProgress /></CartItemWrap>);
    }
    return (
      <CartItemWrap>
        <ItemImage
          src={data.url}
          alt={data.name}
        />
        <ItemTitle>
          {data.name}
          {
            data.availableQty < this.props.qty &&
            <SoldOutError>Item is Sold Out</SoldOutError>
          }
        </ItemTitle>
        <Quantity
          size={40}
          onChange={qty => this.props.onQtyChange(this.props.id, qty)}
          initialQuantity={this.props.qty}
        />
        <DeleteIconWrap>
          <IconButton
            iconStyle={{
            color: '#aaa',
            fontSize: 28,
          }}
            onClick={() => this.props.onDelete(this.props.id)}
            iconClassName="material-icons"
          >delete
          </IconButton>
        </DeleteIconWrap>
      </CartItemWrap>
    );
  }
}

CartItem.propTypes = {
  qty: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onDataReceived: PropTypes.func.isRequired,
};

export default CartItem;
