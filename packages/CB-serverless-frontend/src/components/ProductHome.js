import React, { Component } from 'react';
import axios from 'axios';


import { Wrapper } from '../base_components';
import ProductRow from './ProductRow';

class ProductHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      catData: null
    };
  }


  componentDidMount() {
    axios.get('http://localhost:3000/groceries')
      .then(res => {
        this.setState({
          catData: res.data
        });
      });
  }


  render() {
    const { catData } = this.state;
    console.log('catData', this.state.catData);
    return (
      <React.Fragment>
        <Wrapper>
          {catData && catData.map(obj => {
            const title = obj.category.toProperCase();
            const items = obj.groceries;
            return (<ProductRow title={title} key={title} items={items} />);
          })}
        </Wrapper>
      </React.Fragment>
    );
  }
}


ProductHome.propTypes = {};

export default ProductHome;
