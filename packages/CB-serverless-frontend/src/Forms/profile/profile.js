/*
 Component generated: profile 
*/
import React, { Component } from 'react'
import {
Checkbox,
RadioButtonGroup,
SelectField,
TextField,
Toggle,
DatePicker
} from 'redux-form-material-ui';
import MenuItem from 'material-ui/MenuItem';
import { reduxForm, Field } from 'redux-form';

class Profile extends Component {

	componentDidMount() {
	}

	render() {
		return (
			<form onSubmit={this.props.handleSubmit}>	
				<div> 
					<Field 
						component={TextField}
						name="firstName"
						floatingLabelText="First Name"
					/>
				</div>	
				<div> 
					<Field 
						component={TextField}
						name="lastName"
						floatingLabelText="Last Name"
					/>
				</div>	
				<div> 
					<Field 
						component={TextField}
						name="password"
						type="password"
						floatingLabelText="Password"
					/>
				</div>	
				<div> 
					<Field 
						component={SelectField}
						name="country"
						floatingLabelText="Select Country"
					>
						<MenuItem value="USA" primaryText="USA" />
						<MenuItem value="India" primaryText="India" />
					</Field>
				</div>	
				<div> 
					<Field 
						component={Checkbox}
						name="subscribe"
						floatingLabelText="Subscribe ?"
					/>
				</div>	
				<div> 
					<Field 
						component={DatePicker}
						name="dateOfBirth"
						floatingLabelText="DOB"
					/>
				</div>	
				<div> 
					<Field 
						component={Toggle}
						name="married"
						floatingLabelText="Are you married?"
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		);

	}

}

export default reduxForm({
	form: 'profile'
})(Profile)