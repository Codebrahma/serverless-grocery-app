/* eslint-disable react/forbid-prop-types */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { pinkA200 } from 'material-ui/styles/colors';

import ProductItem from './ProductItem';
import { toProperCase } from '../../utils/string';

const RowWrapper = styled.div`
  margin-bottom: 1em;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  padding: 0 1em 1em;
  margin: 1em auto 5em;
  box-shadow: 0 0 26px 0 #eee;
  background: #eee;

  @media (max-width: 922px) {
    justify-content: space-evenly;
  }
`;

const ProductTitle = styled.h1`
  color: #4f4d4d;
  letter-spacing: 0.5px;
  padding: 1em 8px;
`;

const MoreText = styled.span`
  display: inline-block;
  float: right;
  font-size: 16px;
  > a {
    color: ${pinkA200}
  }
`;

/**
  Row containing product items with link to category page.
*/

const ProductRow = ({ title, items }) => (
  <RowWrapper>
    <ProductTitle>
      {toProperCase(title)}
      <MoreText>
        <Link to={`/category/${title}`} href={`/category/${title}`}> More &#x27F6;</Link>
      </MoreText>
    </ProductTitle>
    <ItemsWrapper>
      {
        _.map(items, obj => (
          <ProductItem
            key={obj.groceryId}
            groceryId={obj.groceryId}
            name={obj.name}
            price={obj.price}
            quant={obj.availableQty}
            url={obj.url}
            issoldout={!obj.availableQty >= 1}
          />
        ))
      }
    </ItemsWrapper>
  </RowWrapper>
);


ProductRow.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default ProductRow;
