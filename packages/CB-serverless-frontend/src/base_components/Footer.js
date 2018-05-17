import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  height: 300px;
  background: #333;
  color: #fff;
  padding: 2em 3em;
`;

const Footer = () => (
  <FooterWrapper>
    &copy; CB
  </FooterWrapper>
);

export default Footer;
