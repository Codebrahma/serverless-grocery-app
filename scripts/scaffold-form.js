var path = require('path');
var fs = require('fs-extra');
var util = require('util');
const _ = require('lodash');
const { generateBackEndFiles } = require('./backendScripts');

var {
  InputText,
  InputSelect,
  InputCheck,
  InputToggle,
  InputDatePicker,
} = require('./htmlInputs');

// Function which logs any value
function log(value) {
  console.log(util.inspect(value, false, null));
}

var component, configFile;

// Handles the command line
var program = require('commander')
  .arguments('-n, --componentName', '<component-name>')
  .arguments('-c', '--config', '<config-name>')
  .action(function (componentName, formConfigFile) {
    component = componentName;
    configFile = formConfigFile;
  })
  .parse(process.argv)

// Scaffolds the form
scaffoldForm(component, configFile);

function generateInputBasedOnType(type, allProps, options) {
  switch (type) {
    case 'text':
      return InputText(type, allProps);
    case 'select':
      return InputSelect(type, allProps, options);
    case 'check':
      return InputCheck(type, allProps);
    case 'toggle':
      return InputToggle(type, allProps);
    case 'date':
      return InputDatePicker(type, allProps);
  }
  
}

function createEachFormElement(type, props, options) {
  // Get the props in array format
  const propsContent = Object.entries(props);
  var renderAllProps = '';

  // Add up all props
  for (var j = 0; j < propsContent.length; j++) {
    renderAllProps += `\n\t\t\t\t\t\t${propsContent[j][0]}="${propsContent[j][1]}"`;
  }

  // Return the form Element with props
  return generateInputBasedOnType(type, renderAllProps, options);

    
}

// Renders the content of the form file
function renderContent(fileName, formElements) {
  
  const imports = 'import {\n' +
    'Checkbox,\n' +
    'RadioButtonGroup,\n' +
    'SelectField,\n' +
    'TextField,\n' +
    'Toggle,\n' +
    'DatePicker\n' +
  `} from 'redux-form-material-ui';\n` +
  `import MenuItem from 'material-ui/MenuItem';\n` +
  `import { reduxForm, Field } from 'redux-form';\n`;

  return (
    `/*\n Component generated: ${fileName} \n*/\n` +
    `import React, { Component } from 'react'\n` +
    imports +
    `\nclass ${_.capitalize(fileName)} extends Component {\n\n` +
      `\tcomponentDidMount() {\n` +
      `\t}\n\n` +
      `\trender() {\n` +
        `\t\treturn (` +
        `\n\t\t\t<form onSubmit={this.props.handleSubmit}>` +
        `${formElements}\n` +
        `\t\t\t\t<button type="submit">Submit</button>\n` +
        '\t\t\t</form>\n' +
        `\t\t);\n\n` +
      `\t}\n\n` +
    `}\n\n` +
    `export default reduxForm({` +
    `\n\tform: '${fileName}'` +
    `\n})(${_.capitalize(fileName)})`
  )
  
}

function rootIndexContent(fileName) {
  return (
    `import React from 'react';\n` +
    
    `import FormComponent from './${fileName}';\n\n` +
    `import config from '../../config';\n` +
    `import { API } from 'aws-amplify';\n\n` +

    `const ${_.capitalize(fileName)} = () => {\n` +
    `const  handleSubmit = async (values) => {\n` +
    `  API.post('todo', '/${fileName}', {\n` +
    `    body: values,\n` +
    `  })\n` +
    `};\n` +

    '\treturn (\n' +
    '\t\t<FormComponent\n' +
    '\t\t\tonSubmit={handleSubmit}\n' +
    '\t\t/>\n' +
    '\t);\n' +
    '}\n' +
    `export default ${_.capitalize(fileName)};`
  );
}

function scaffoldForm(fileName, configName) {
  /* Add Front end related scaffolds */

  // Component root folder
  const componentRootFolder = `./packages/CB-serverless-frontend/src/Forms/${fileName}`;
  const configRootFolder = `./configs/${configName}`;

  var root = path.resolve(componentRootFolder);
  var config = path.resolve(configRootFolder);

  var formConfig = require(config);

  var formElements = '';
  const formElementValues = formConfig.formConfig.form;
  for (i = 0; i < formElementValues.length; i++) {
    const formConfigValues = formElementValues[i];
    const {
      type,
      props,
      options = []
    } = formConfigValues;
    formElements += createEachFormElement(type, props, options);
  }

  // Creates root folder
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  // create a css file with the name provided for the scaffold
  fs.writeFileSync(
    path.join(root, `${fileName}.scss`),
    `/* CSS File for the ${fileName} form generated. You can add styles here to change the styling of this form*/\n`
  )
  
  // Writes the content for JSX file which is the form
  fs.writeFileSync(
    path.join(root, `index.js`),
    rootIndexContent(fileName)
  )
  // Writes the content for JSX file which is the form
  fs.writeFileSync(
    path.join(root, `${fileName}.js`),
    renderContent(fileName, formElements)
  )
  var Routes = path.resolve('packages/CB-serverless-frontend/src/routes.js');

  fs.readFile(Routes, function(err, data) {
    if(err) throw err;
    //data = data.toString();
    const importFileContent = `import ${_.capitalize(fileName)} from './Forms/${fileName}';\n`;
    var array = [importFileContent, ...data.toString().split("\n")];

    var insertToIndex;

    for (var i = 0; i < array.length; i++) {
      const foundIndex = _.includes(array[i], '<Router>');
      if (foundIndex) {
        insertToIndex = i;
      }
    }

    const insertContent = `         <Route path="/${fileName}" component={${_.capitalize(fileName)}} />\n`;
    
    const newArray = [...array.slice(0, insertToIndex + 1), insertContent, ...array.slice(insertToIndex + 1)];
    
    let result = '';
    for(var u=0; u<newArray.length; u++) {
      result += (newArray[u]+'\n');
    }
    fs.writeFileSync(Routes, result);

  });

  /* Add Backened related scaffolds */
  generateBackEndFiles(fileName, formElementValues);
}