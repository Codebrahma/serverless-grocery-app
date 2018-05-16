import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CountSpan = styled.button`
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  border-radius: ${props => (props.right ? '0px 4px 4px 0px' : '4px 0 0 4px')};
  background: #f5f5f5;
  border: 1px solid #ddd;
  
  width: 25px;
  height: 25px;
`;

const CountInput = styled.input`
  height: 25px;
  width: 35px;
  padding-left: 12px;
`;

const RowFlex = styled.div`
  display: flex;
  margin-right: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

class Quantity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.initialQuantity,
    };
  }

  dec = () => {
    const { disabled } = this.props;

    const { count: currentCount } = this.state;
    if (!disabled && currentCount >= 2) { // minimum quantity to be one
      this.setState((s, p) => ({
        count: s.count - 1,
      }), () => this.props.onChange(this.state.count));
    }
  };

  inc = () => {
    const { disabled } = this.props;

    const { count: currentCount } = this.state;
    if (!disabled && currentCount < 10) { // minimum quantity to be one
      this.setState((s, p) => ({
        count: s.count + 1,
      }), () => this.props.onChange(this.state.count));
    }
  };

  render() {
    const { disabled } = this.props;
    return (
      <RowFlex>
        <CountSpan onClick={this.dec}>-</CountSpan>
        <CountInput disabled={disabled} type="text" min="1" max="10" step="1" value={this.state.count} />
        <CountSpan right onClick={this.inc}>+</CountSpan>
      </RowFlex>
    );
  }
}

Quantity.defaultProps = {
  initialQuantity: 1,
  disabled: false,
};

Quantity.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialQuantity: PropTypes.number,
  disabled: PropTypes.bool,
};


export default Quantity;
