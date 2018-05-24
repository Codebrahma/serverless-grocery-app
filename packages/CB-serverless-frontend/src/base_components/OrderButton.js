/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import { RaisedButton } from 'material-ui';
import PropTypes from 'prop-types';

const CheckoutButton = styled(RaisedButton)`
  margin-bottom: 2em;
  > button {
    color: #fff;
  }
`;

const OrderButton = ({
  backgroundColor, fullWidth, disabled, buttonStyle, overlayStyle, onClick, title,
}) => (
  <CheckoutButton
    backgroundColor={backgroundColor || '#6ca749'}
    fullWidth={fullWidth}
    disabled={disabled}
    buttonStyle={{
      ...{
        padding: '0 0em',
        height: '100%',
        fontSize: '1em',
      },
      ...buttonStyle,
    }}
    overlayStyle={{
      ...{
        padding: '0.5em',
        height: '100%',
      },
      ...overlayStyle,
    }}
    onClick={onClick}
  >
    {title}
  </CheckoutButton>
);

OrderButton.defaultProps = {
  backgroundColor: '#6ca749',
  fullWidth: false,
  disabled: false,
  buttonStyle: {},
  overlayStyle: {},
};

OrderButton.propTypes = {
  backgroundColor: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  buttonStyle: PropTypes.object,
  overlayStyle: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};


export default OrderButton;
