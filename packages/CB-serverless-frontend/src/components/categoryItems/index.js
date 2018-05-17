import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Checkbox from 'material-ui/Checkbox';
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
      fetchingData: true
    };
  }


  componentDidMount() {
    const {category} = this.props;
    let catData = {};
    axios.get('http://localhost:3000/groceries?category=' + category)
      .then(response => {
        const {data} = response;
        const {Items} = data;
        let subCategories = Items.map(item => item.subCategory);
        subCategories = Array.from(new Set(subCategories))
        let checked = {};
        subCategories.map((category) => {
          checked[category] = true;
          return;
        });
        this.setState({
          items: Items,
          subCategories,
          checked,
          fetchingData: false
        });
      }).catch(() => {
        this.setState({fetchingData: false});
      });
  }

  onCheck = (value) => {
    const newValue = {[value]: !this.state.checked[value]};
    this.setState({
      checked: {...this.state.checked, [value]: !this.state.checked[value]},
    });
  }

  getItemsToShow = () => {
    const {checked, items} = this.state;
    let noItemAvailable = true;
    const CategoryItems = items.map(item => {
      if (checked[item.subCategory]) {
        noItemAvailable = false;
        return (
          <ProductItem
            key={item.groceryId}
            name={item.name}
            price={item.price}
            url={item.url}
            isSoldOut={Math.random()>0.5}
        />
        )
      }
    });
    return {CategoryItems, noItemAvailable};
  }

  render() {
    const {items, subCategories, checked, fetchingData} = this.state;
    const {CategoryItems, noItemAvailable} = this.getItemsToShow();
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
            noItemAvailable?
            (
              fetchingData? <CircularProgress style={{margin: 'auto'}} /> :
              <div style={{margin: 'auto'}}>
                No item is available
              </div>
            ) :
            CategoryItems
          }
          </ItemsWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

CategoryItems.propTypes = {};

export default CategoryItems;
