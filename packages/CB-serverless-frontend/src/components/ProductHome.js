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
    const categories = ['eatable', 'drinkable', 'cookable', 'hygiene'];
    let catData = [];
    categories.forEach(cat => {
      axios.get('http://localhost:3000/groceries?category=' + cat)
        .then(res => {
          const top3 = res.data.Items.splice(0, 5);
          catData.push({
            [cat]: top3
          });
          this.setState({
            catData: catData
          });
        });
    });
  }


  render() {
    const {catData} = this.state;
    console.log('catData', this.state.catData);
    return (
      <React.Fragment>
        <Wrapper>
          {catData && catData.map(obj=>{
            const key = Object.keys(obj)[0];
            return (<ProductRow title={key} key={key} items={obj[key]} />);
          })}
        </Wrapper>
      </React.Fragment>
    );
  }
}


ProductHome.propTypes = {};

export default ProductHome;
