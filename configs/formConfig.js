/*
Must:
1. Get the config file with -config command

Config:

name: Component name

type: Pure / Class based

form: [
  {
    type: can be one of text, select, check, button, radio
    design: material / html'
    props: {
      prop1: value1,
      prop2: value2,
      ...
    }
  },
  {
    type: can be one of text, select, check, button, radio
    design: material / html'
    props: {
      prop1: value1,
      prop2: value2,
      ...
    }
  },
]
*/

const formConfig = {
  form: [
    {
      type: 'text',
      props: {
        name: 'text',
        floatingLabelText: 'TextField'
      }
    },
    {
      type: 'select',
      options: [
        { label: 'option 1', value: 'option1' },
        { label: 'option 2', value: 'option2' },
      ],
      props: {
        name: 'select',
        floatingLabelText: 'SelectField'
      }
    },
    {
      type: 'check',
      props: {
        name: 'check',
        floatingLabelText: 'CheckField'
      }
    },
    {
      type: 'date',
      props: {
        name: 'date',
        floatingLabelText: 'DateField'
      }
    },
    {
      type: 'toggle',
      props: {
        name: 'toggle',
        floatingLabelText: 'ToggleField'
      }
    },
  ]
}

module.exports = {
  formConfig: formConfig,
}