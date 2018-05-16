import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { Wrapper } from '../base_components';
import ProductRow from './ProductRow';

class ProductHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catData: null,
      error: null,
    };
  }


  componentDidMount() {
    axios.get('http://localhost:3000/groceries')
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


  showErrorMessage = () => (
    <div>{JSON.stringify(this.state.error)}</div>
  );

  render() {
    const { catData } = this.state;
    return (
      <React.Fragment>
        <Wrapper>
          {
            catData &&
            _.map(catData, (obj) => {
              const title = obj.category.toProperCase();
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
