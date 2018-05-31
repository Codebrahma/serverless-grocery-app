import styled from 'styled-components';


/**
 * Product Item loading component
 */
const ProductSkeleton = styled.div`
  margin: 1em 0.5em;
  width: 270px;
  background: #fff;
  background-repeat: no-repeat;
  background-image:
            linear-gradient(90deg, rgba(243,243,243,0) 0, rgba(243,243,243,0.4) 50%,
             rgba(243,243,243,0) 100%), 
            linear-gradient(#f3f3f3 230px,transparent 0), // image
            linear-gradient(#f3f3f3 25px, transparent 0), // title
            linear-gradient(#f3f3f3 20px, transparent 0), // price
            linear-gradient(#f3f3f3 37px, transparent 0), // price
            linear-gradient(#fff 394px, transparent 0);
  background-size:
            200px 100%,
            90% 230px, 
            90% 25px,
            80px 20px,
            100px 37px,
            100% 100%;
  background-position:
            -150% 0, 
            50% 20px,
            50% 270px,
            1em 310px,
            90% 345px,
            0% 0%;
  height: 394px;
  animation: loading 1s infinite;
`;

export default ProductSkeleton;
