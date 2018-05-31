import React from 'react';
import styled from 'styled-components';
import Checkbox from 'material-ui/Checkbox';

const Container = styled.div`
  width: 25%;
  margin: 2em 1em;
  background: #fff;
  padding: 2em 1em;
  height: 100%;
  box-shadow: 0px 0px 10px 0px #ddd;
`;

const SubCategorySkeleton = styled.div`
  margin: 1em 0em;
  width: 100%;
  background: #fff;
  background-repeat: no-repeat;
  background-image: linear-gradient(90deg,rgba(243,243,243,0) 0,rgba(243,243,243,0.4) 50%, rgba(243,243,243,0) 100%), linear-gradient(#f3f3f3 30px,transparent 0), linear-gradient(#f3f3f3 31px,transparent 0);
  background-size: 100px 100%, 30px 50px, 50% 20px;
  background-position: -150% 0, 5px 5px, 40% 10px;
  height: 40px;
  animation: loadingSubCat 2s infinite;
`;

/**
  Checkboxes with sub-categories to filter items in category page.
*/

export default ({ subCategories, checked, onCheck }) => (
  <Container>
    {
      subCategories.length === 0 &&
      [1, 2, 3, 4].map(val => (
        <SubCategorySkeleton>
            &nbsp;
        </SubCategorySkeleton>
        ))
    }
    {
    subCategories.map((value, index) => {
      const label = value.charAt(0).toUpperCase() + value.slice(1);
      return (
        <div
          style={{
            padding: '1em 0em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          key={index}
        >
          <Checkbox
            label={label}
            checked={checked[value]}
            onCheck={() => (onCheck(value))}
            style={{ marginBottom: 0 }}
            labelStyle={{ textAlign: 'left', marginLeft: '5%' }}
          />
        </div>
      );
    })
  }
  </Container>
);
