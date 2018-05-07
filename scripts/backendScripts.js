const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const generateModel = (fileName, config) => {
  var modelItems = '';
  for (var i = 0; i < config.length; i++) {
    modelItems += config[i].type === 'date' ? `\t${config[i].props.name}: Date,\n` : `\t${config[i].props.name}: String,\n`
  }
  const result = `const mongoose = require('mongoose');\n\n` +
  `const ${_.capitalize(fileName)}Schema = new mongoose.Schema({\n` +
  modelItems +
  `});\n` +
  `\nexport default mongoose.model('${_.capitalize(fileName)}', ${_.capitalize(fileName)}Schema);`
  
  return result;
};

generateApi = (fileName) => {
  const result = `import mongoose from 'mongoose';\n` +
  `import connectToDatabase from '../../db';\n` +
  `import ${_.capitalize(fileName)} from '../../models/${_.capitalize(fileName)}';\n\n` +

  `const renderServerError = (response, errorMessage) => response(null, {\n` +
    `\tstatusCode: 500,\n` +
    `\theaders: { 'Content-Type': 'application/json' },\n` +
    `\tbody: { success: false, error: errorMessage },\n` +
  `});\n\n` +
  `export const getAll${_.capitalize(fileName)} = (event, context, callback) => {\n` +
    `\tcontext.callbackWaitsForEmptyEventLoop = false;\n` +
  
    `\tconnectToDatabase().then(() => {\n` +
      `\t\t${_.capitalize(fileName)}.find({}, (error, data) => {\n` +
        `\t\t\tcallback(null, { statusCode: 200, headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(data) })\n` +
      `\t\t});\n` +
    `\t})\n` +
    `\t.catch(() => renderServerError(callback, 'Unable to fetch! Try again later'));\n` +
  `}\n\n` +
  `export const create${_.capitalize(fileName)} = (event, context, callback) => {\n` +
    `\tcontext.callbackWaitsForEmptyEventLoop = false;\n` +
    `\tconnectToDatabase().then(() => {\n` +
      `\t\t${_.capitalize(fileName)}.create(JSON.parse(event.body), (error, data) => {\n` +
        `\t\t\tcallback(null, { statusCode: 200, headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(data) })\n` +
      `\t\t});\n` +
    `\t})\n` +
    `\t.catch(() => renderServerError(callback, 'Unable to create! Try again later'));\n` +
  `}`;

  return result;
}

const insertNewHandlers = (handlerFile, fileName) => {

  fs.readFile(handlerFile, function(err, data) {
    if(err) throw err;
    //data = data.toString();
    const importFileContent = `import { getAll${_.capitalize(fileName)}, create${_.capitalize(fileName)} } from './api/${fileName}';`;
    
    var array = [importFileContent, ...data.toString().split("\n")];

    var insertToIndex;

    for (var i = 0; i < array.length; i++) {
      const foundIndex = _.includes(array[i], 'export {');
      if (foundIndex) {
        insertToIndex = i;
      }
    }

    const insertContent = `\tgetAll${_.capitalize(fileName)},\n` +
    `\tcreate${_.capitalize(fileName)},`
    
    const newArray = [...array.slice(0, insertToIndex + 1), insertContent, ...array.slice(insertToIndex + 1)];
    
    let result = '';
    for(var u=0; u<newArray.length; u++) {
      result += (newArray[u]+'\n');
    }
    fs.writeFileSync(handlerFile, result);

  });
}

const editYmlFile = (handlerFile, fileName) => {
  const appendedYml = (
    `\n  create:` +
    `\n    handler: handler.create${_.capitalize(fileName)}` +
    `\n    events:` +
    `\n      - http:` +
    `\n          path: ${fileName}` +
    `\n          method: post` +
    `\n          cors: true\n` +
    `\n  get:` +
    `\n    handler: handler.getAll${_.capitalize(fileName)}` +
    `\n    events:` +
    `\n      - http:` +
    `\n          path: ${fileName}` +
    `\n          method: get` +
    `\n          cors: true`
  );
  fs.appendFileSync(handlerFile, appendedYml);
}

const generateBackEndFiles = (fileName, config) => {

  // Generate a Model
  const apiFolder = path.resolve(`./packages/CB-serverless-backend/api/${fileName}`);
  const modelFile = path.resolve(`./packages/CB-serverless-backend/models/${_.capitalize(fileName)}.js`);
  
  if (!fs.existsSync(apiFolder)) {
    fs.mkdirSync(apiFolder);
  }
  
  fs.writeFileSync(modelFile, generateModel(fileName, config));

  // Create a folder under API. Create getFormData and postFormData
  const apiIndexFile = path.resolve(`./packages/CB-serverless-backend/api/${fileName}/index.js`);

  fs.writeFileSync(apiIndexFile, generateApi(fileName, config));
  
  // Handlers import and export
  const handlerFile = path.resolve(`./packages/CB-serverless-backend/handler.js`);
  insertNewHandlers(handlerFile, fileName);

  // Serverless.yaml
  const serverlessYaml = path.resolve(`./packages/CB-serverless-backend/serverless.yml`);
  editYmlFile(serverlessYaml, fileName)

}

module.exports = {
  generateBackEndFiles: generateBackEndFiles,
}