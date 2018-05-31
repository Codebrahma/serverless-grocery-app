import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';
import _ from 'lodash';
import {profileHomeSelector} from '../selectors/profile-home';

import { Wrapper } from '../base_components';

const Heading = styled.h1`
  padding: 0 1em 1em;
  border-bottom: 1px solid #eee;
  margin-bottom: 2em;
`;

const Field = styled.div`
  padding: 1em;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  > input.profileInput, .profileInput {
    padding: 1em 2em;
    flex: 1 1 20%;
    border-radius: 30px;
    color: #555;
    font-size: 16px;
    border: 1px solid #ddd;
  }

  > span:first-child{
    flex: 0 0 150px;
    font-weight: bold;
    letter-spacing: 0.3px;
    padding-right: 10px;
    display: inline-block;
    text-align: left;
  }

  > span.profileInputDisabled{
    flex: 1 1 20%;
    background: #eee;
    padding: 0.5em 2em;
    border-radius: 30px;
    color: #aaa;
    border: 1px solid #ddd;
  }
`;

const Verified = styled.span`
  flex: 0 0 30px;
  float: right;
  font-size: 16px;
  padding: 5px 8px;
  //background: ${props => (props.isVerified ? '#bbffbd' : '#ffc3bd')};
  color: ${props => (props.isVerified ? '#18c532' : 'darkred')};
  border: 1px solid ${props => (props.isVerified ? '#70b870' : '#850000')};
  border-radius: 15px;
  margin-left: 1em;
`;

/**
  Profile page with user info: Name, email, phoneNumber,
  and button to save the changes in name/phoneNumber.
*/

class ProfileHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: this.props.name,
      phoneNumber: this.props.phoneNumber,
    };
  }

  handleChange = (e) => {
    if (!_.isEmpty(e.target) && !_.isEmpty(e.target.name)) {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  saveProfile = () => {
    const { fullName, phoneNumber } = this.state;
    alert(fullName + phoneNumber);
  };


  render() {
    const { fullName, phoneNumber } = this.state;
    const { attributes } = this.props.userData;
    const {
      isPhoneNumberEmpty,
      isFullNameEmpty,
      name,
      email,
      emailVerified,
      phoneNumberVerified
    } = this.props;
    const saveDisabled = ((isFullNameEmpty && isPhoneNumberEmpty))
      || (_.isEqual(fullName, name) && _.isEqual(phoneNumber, this.props.phoneNumber));
    return (
      <Wrapper
        style={{
          width: '50%',
          margin: '1em auto',
          textAlign: 'left',
          padding: '2em',
        }}
      >
        <Heading>
          My Profile
        </Heading>
        <Field>
          <span>Name:</span>
          <input
            type="text"
            name="fullName"
            required
            className="profileInput"
            value={fullName || name}
            onChange={this.handleChange}
          />
        </Field>
        <Field>
          <span>Email:</span>
          <span className="profileInputDisabled">
            {email}
          </span>
          <Verified
            className="material-icons"
            isVerified={emailVerified}
          >
            verified_user
          </Verified>
        </Field>
        <Field>
          <span>Phone Number:</span>
          <input
            type="text"
            name="phoneNumber"
            className="profileInput"
            value={phoneNumber || this.props.phoneNumber}
            onChange={this.handleChange}
          />
          <Verified
            className="material-icons"
            isVerified={phoneNumberVerified}
          >verified_user
          </Verified>
        </Field>

        <RaisedButton
          label="Save"
          secondary
          disabled={saveDisabled}
          style={{
            display: 'block',
            width: '40%',
            margin: '2em auto',
          }}
          onClick={this.saveProfile}
        />

      </Wrapper>
    );
  }
}

ProfileHome.defaultProps = {
  userData: {},
};


ProfileHome.propTypes = {
  isPhoneNumberEmpty: PropTypes.bool.isRequired,
  isFullNameEmpty: PropTypes.bool.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  emailVerified: PropTypes.bool.isRequired,
  phoneNumberVerified: PropTypes.bool.isRequired,
};

function initMapStateToProps(state) {
  const {
    isPhoneNumberEmpty,
    isFullNameEmpty,
    phoneNumber,
    name,
    email,
    emailVerified,
    phoneNumberVerified
  } = profileHomeSelector(state);
  return {
    isPhoneNumberEmpty,
    isFullNameEmpty,
    phoneNumber,
    name,
    email,
    emailVerified,
    phoneNumberVerified
  };
}

function initMapDispatchToProps() {

}

export default connect(initMapStateToProps, initMapDispatchToProps)(ProfileHome);
