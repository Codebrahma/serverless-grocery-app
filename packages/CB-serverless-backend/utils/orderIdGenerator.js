const idSuffix = () => Math.random().toString(36).substr(2, 9).toUpperCase();
const idPrefix = () => new Date().toISOString().substring(0, 10).replace(/-/g,"");
const generateId = () => (`${idSuffix()}-${idPrefix()}`);

export default generateId;