const InputText = (design = "html", allProps) => {
  return (
    `\t\n` +
    `\t\t\t\t<div> \n` +
    `\t\t\t\t\t<Field \n` +
    `\t\t\t\t\t\tcomponent={TextField}` +
    `${allProps}` +
    `\n\t\t\t\t\t/>` +
    `\n\t\t\t\t</div>`
  )
}

const InputSelect = (design = "html", allProps, options) => {
  var menuItem = '';
  for (var k = 0; k < options.length; k++) {
    menuItem += `\n\t\t\t\t\t\t<MenuItem value="${options[k].value}" primaryText="${options[k].label}" />`;
  }
  return (
    `\t\n` +
    `\t\t\t\t<div> \n` +
    `\t\t\t\t\t<Field \n` +
    `\t\t\t\t\t\tcomponent={SelectField}` +
    `${allProps}` +
    `\n\t\t\t\t\t>` +
    `${menuItem}\n` +
    `\t\t\t\t\t</Field>` +
    `\n\t\t\t\t</div>`
  );
}

const InputCheck = (design = "html", allProps) => {
  return (
    `\t\n` +
    `\t\t\t\t<div> \n` +
    `\t\t\t\t\t<Field \n` +
    `\t\t\t\t\t\tcomponent={Checkbox}` +
    `${allProps}` +
    `\n\t\t\t\t\t/>` +
    `\n\t\t\t\t</div>`
  )
}

const InputToggle = (design = "html", allProps) => {
  return (
    `\t\n` +
    `\t\t\t\t<div> \n` +
    `\t\t\t\t\t<Field \n` +
    `\t\t\t\t\t\tcomponent={Toggle}` +
    `${allProps}` +
    `\n\t\t\t\t\t/>` +
    `\n\t\t\t\t</div>`
  )
}

const InputDatePicker = (design = "html", allProps) => {
  return (
    `\t\n` +
    `\t\t\t\t<div> \n` +
    `\t\t\t\t\t<Field \n` +
    `\t\t\t\t\t\tcomponent={DatePicker}` +
    `${allProps}` +
    `\n\t\t\t\t\t/>` +
    `\n\t\t\t\t</div>`
  )
}

module.exports = {
  InputText: InputText,
  InputCheck: InputCheck,
  InputSelect: InputSelect,
  InputToggle: InputToggle,
  InputDatePicker: InputDatePicker,
}
  

