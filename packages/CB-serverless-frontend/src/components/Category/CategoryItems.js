/* eslint-disable react/no-unused-prop-types,react/forbid-prop-types */
import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';

import ProductItem from '../Product/ProductItem';
import SubCategories from './sub-categories';
import * as API from '../../service/grocery';
import ProductSkeleton from '../../base_components/ProductSkeleton';

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  padding-bottom: 1em;
  margin: 1em auto;
  box-shadow: 0 0 26px 0 #eee;
  background: #eee;
  width: 75%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 1em;
  margin: 1em auto;
  box-shadow: 0 0 26px 0 #eee;
  background: #eee;
  height: 100%;
`;

/**
  Display all the items for the particular category.
  having option to filter the items based on sub-categoryies.
*/

class CategoryItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      subCategories: [],
      checked: {},
      fetchingData: true,
    };
  }

  componentDidMount() {
    if (
      this.isValid(this.props.match)
      && this.isValid(this.props.match.params)
      && this.isValid(this.props.match.params.category)
    ) {
      const { category } = this.props.match.params;

      API.getCategoryGroceries(category).then((response) => {
        const { data } = response;
        const { Items } = data;
        let subCategories = Items.map(item => item.subCategory);
        subCategories = Array.from(new Set(subCategories));
        const checked = {};
        subCategories.map((cat) => {
          checked[cat] = true;
          return true;
        });
        this.setState({
          items: Items,
          subCategories,
          checked,
          fetchingData: false,
        });
      }).catch(() => {
        this.setState({ fetchingData: false });
      });
    } else {
      this.props.history.push('/');
    }
  }

  onCheck = (value) => {
    // const newValue = { [value]: !this.state.checked[value] };
    this.setState({
      checked: { ...this.state.checked, [value]: !this.state.checked[value] },
    });
  };

  getItemsToShow = () => {
    const { checked, items } = this.state;
    let noItemAvailable = true;
    const categoryItems = items.map((item) => {
      if (checked[item.subCategory]) {
        noItemAvailable = false;
        return (
          <ProductItem
            key={item.groceryId}
            groceryId={item.groceryId}
            name={item.name}
            price={item.price}
            quant={item.availableQty}
            url={item.url}
            issoldout={!item.availableQty >= 1}
          />
        );
      }
      return null;
    });
    return { categoryItems, noItemAvailable };
  };

  isValid = st => !_.isEmpty(st) && !_.isNil(st);

  renderNoItems = () => {
    const { fetchingData } = this.state;
    const { categoryItems, noItemAvailable } = this.getItemsToShow();

    if (noItemAvailable && !fetchingData) {
      return (
        <div style={{ margin: 'auto' }}>
          No items available.
        </div>
      );
    }
    if (!categoryItems && noItemAvailable && fetchingData) {
      return (<CircularProgress style={{ margin: 'auto' }} />);
    }
    return null;
  };

  skeletons = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <ProductSkeleton key={i} />);

  render() {
    const { subCategories, checked } = this.state;
    const { categoryItems, noItemAvailable } = this.getItemsToShow();
    return (
      <React.Fragment>
        <Container>
          {
            <SubCategories
              subCategories={subCategories}
              checked={checked}
              onCheck={this.onCheck}
            />
          }
          <ItemsWrapper>
            {
              this.renderNoItems()
            }
            {
              this.state.items.length === 0 && !noItemAvailable
              && this.skeletons()
            }
            {
              !noItemAvailable &&
              categoryItems
            }
          </ItemsWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

CategoryItems.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      category: PropTypes.string.isRequired,
    }),
  }).isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(CategoryItems);
