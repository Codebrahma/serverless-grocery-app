
// Add new method to String class to convert string into ProperCase
// eg., a title => A Title

export function toProperCase(st) {
  return st.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export default {
  toProperCase,
};
