const formConfig = {
  form: [
    {
      type: 'text',
      props: {
        name: 'firstName',
        floatingLabelText: 'First Name'
      }
    },
    {
      type: 'text',
      props: {
        name: 'lastName',
        floatingLabelText: 'Last Name'
      }
    },
    {
      type: 'text',
      props: {
        name: 'password',
        type: 'password',
        floatingLabelText: 'Password'
      }
    },
    {
      type: 'select',
      options: [
        { label: 'USA', value: 'USA' },
        { label: 'India', value: 'India' },
      ],
      props: {
        name: 'country',
        floatingLabelText: 'Select Country'
      }
    },
    {
      type: 'check',
      props: {
        name: 'subscribe',
        floatingLabelText: 'Subscribe ?'
      }
    },
    {
      type: 'date',
      props: {
        name: 'dateOfBirth',
        floatingLabelText: 'DOB'
      }
    },
    {
      type: 'toggle',
      props: {
        name: 'married',
        floatingLabelText: 'Are you married?'
      }
    },
  ]
}

module.exports = {
  formConfig: formConfig,
}