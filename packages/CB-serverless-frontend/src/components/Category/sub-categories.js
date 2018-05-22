import React from 'react';
import styled from 'styled-components';
import Checkbox from 'material-ui/Checkbox';

const Container = styled.div`
  width: 15%;
  margin-top: 5%;
`;

export default ({ subCategories, checked, onCheck }) => (
  <Container>
    {
    subCategories.map((value, index) => {
      const label = value.charAt(0).toUpperCase() + value.slice(1);
      return (
        <div key={index}>
          <Checkbox
            label={label}
            checked={checked[value]}
            onCheck={() => (onCheck(value))}
            style={{ marginBottom: 16 }}
            labelStyle={{ textAlign: 'left', marginLeft: '5%' }}
          />
        </div>
      );
    })
  }
  </Container>
);
