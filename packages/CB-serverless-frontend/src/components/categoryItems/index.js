/* eslint-disable react/no-unused-prop-types,react/forbid-prop-types */
import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';


import ProductItem from '../ProductItem';
import SubCategories from './sub-categories';

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
  width: 85%;
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

class CategoryItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      subCategories: [],
      checked: {},
      fetchingData: true,
    };
    console.log(this.props);
  }

  componentDidMount() {
    console.log(this.props);
    if (
      this.isValid(this.props.match)
      && this.isValid(this.props.match.params)
      && this.isValid(this.props.match.params.category)
    ) {
      const { category } = this.props.match.params;

      axios.get(`http://localhost:3000/groceries?category=${category}`)
        .then((response) => {
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
            name={item.name}
            price={item.price}
            url={item.url}
            isSoldOut={Math.random() > 0.5}
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
          No item is available
        </div>
      );
    }
    if (!categoryItems && noItemAvailable && fetchingData) {
      return (<CircularProgress style={{ margin: 'auto' }} />);
    }
    return null;
  };

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
