/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';

import ProductItem from './ProductItem';

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
  padding-bottom: 1em;
  margin: 1em auto;
  box-shadow: 0 0 26px 0 #eee;
  background: #eee;
`;

const ProductTitle = styled.h1`
  color: #4f4d4d;
  letter-spacing: 0.5px;
  padding: 1em 8px;
`;

const ProductRow = ({ title, items }) => (
  <RowWrapper>
    <ProductTitle>{title.toProperCase()}</ProductTitle>
    <ItemsWrapper>
      {
          _.map(items, obj => (
            <ProductItem
              name={obj.name}
              price={obj.price}
              url={obj.url}
              isSoldOut={Math.random() > 0.5}
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
