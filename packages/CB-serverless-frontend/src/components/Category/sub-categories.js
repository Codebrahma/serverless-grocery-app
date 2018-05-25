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

export default ({ subCategories, checked, onCheck }) => (
  <Container>
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
