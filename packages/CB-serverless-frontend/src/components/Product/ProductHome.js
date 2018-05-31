import React, { Component } from 'react';
import _ from 'lodash';

import { Wrapper } from '../../base_components/index';
import ProductRow from './ProductRow';
import * as API from '../../service/grocery';

/**
  Home page to show top three items from each categories.
  having options to add items to the cart and
  go to the particular category to see all the items.
*/

class ProductHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catData: null,
      error: null,
    };
  }

  componentDidMount() {
    API.getTop3Groceries()
      .then((res) => {
        this.setState((state, props) => ({
          catData: res.data,
        }));
      })
      .catch((err) => {
        this.setState((state, props) => ({
          error: err,
        }));
      });
  }

  showErrorMessage = () => {
    if (this.state.error) {
      return (
        <div>{JSON.stringify(this.state.error)}</div>
      );
    }
    return null;
  };

  render() {
    const { catData } = this.state;
    return (
      <React.Fragment>
        <Wrapper>
          {
            catData &&
            _.map(catData, (obj) => {
              const title = obj.category;
              const items = obj.groceries;
              return (
                <ProductRow
                  title={title}
                  key={title}
                  items={items}
                />);
            })
          }

          {
            this.showErrorMessage()
          }
        </Wrapper>
      </React.Fragment>
    );
  }
}

ProductHome.propTypes = {};

export default ProductHome;
