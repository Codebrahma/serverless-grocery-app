import styled from 'styled-components';
import { CardMedia } from 'material-ui';

const ProductImageWrap = styled(CardMedia)`
  border-bottom: 1px solid #eee;
  padding: 10px;
  width: ${props => (props.width ? `${props.width}px` : '250px')};
  height: ${props => (props.height ? `${props.height}px` : '250px')};
  margin: 0 auto;
  opacity: ${props => (props.issoldout === 'true' ? '0.4' : '1')};
`;

export default ProductImageWrap;
