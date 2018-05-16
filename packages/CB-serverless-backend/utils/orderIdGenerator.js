const idSuffix = () => Math.random().toString(36).substr(2, 9);
const idPrefix = () => new Date().toISOString().substring(0, 10).replace(/-/g,"");
export default generateId = () => `${idSuffix()}-${idPrefix()}`;