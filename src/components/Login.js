import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

//Material UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};
class Login extends Component {

  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: ''
  }

  render() {

    return (
      <div>
        <h4 className='mv3'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className='flex flex-column'>
          {!this.state.login &&

          <TextField
          hintText="Your name"
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
          ></TextField><br />
          }

          <TextField
          hintText="Your email address"
          value={this.state.email}
          onChange={(e) => this.setState({ email: e.target.value })}
          ></TextField><br />

          <TextField
          hintText="Choose a safe password"
          type="password"
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
          /><br />
        </div>
        <div>
          <RaisedButton style={style} label={this.state.login ? 'login' : 'create account' } primary={true} onClick={() => this._confirm()} />
          <RaisedButton style={style} label={this.state.login ? 'need to create an account?' : 'already have an account?'} primary={true} onClick={() => this.setState({ login: !this.state.login })} />
        </div>
      </div>
    )
  }

  _confirm = async () => {
    const { name, email, password } = this.state
    if (this.state.login) {
      const result = await this.props.authenticateUserMutation({
        variables: {
          email,
          password
        }
      })
      const { id, token } = result.data.authenticateUser
      this._saveUserData(id, token)
    } else {
      const result = await this.props.signupUserMutation({
        variables: {
          name,
          email,
          password
        }
      })
      const { id, token } = result.data.signupUser
      this._saveUserData(id, token)
    }
    this.props.history.push(`/`)
  }

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

}


const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation($email: String!, $password: String!, $name: String!) {
    signupUser(
      email: $email,
      password: $password,
      name: $name
    ) {
      id
      token
    }
  }
`

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUser(
      email: $email,
      password: $password
    ) {
      id
      token
    }
  }
`

export default compose(
  graphql(SIGNUP_USER_MUTATION, { name: 'signupUserMutation' }),
  graphql(AUTHENTICATE_USER_MUTATION, { name: 'authenticateUserMutation' })
)(Login)
