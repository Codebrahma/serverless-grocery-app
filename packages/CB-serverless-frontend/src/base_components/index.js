import styled from 'styled-components';

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export const Wrapper = styled.section`
  margin: 2em;
  padding: 1em 3em;
  background: #fff;
`;
