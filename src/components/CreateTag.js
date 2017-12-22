import React, { Component } from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
// Material UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
class CreateTag extends Component {
  state = {
    name:'',
    description:''
  }

  render() {
    return (
      <div>
        <div className='flex flex-column mt3'>
          <TextField
            hintText="Title for Tag"
            value = {this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          /><br/>


        </div>

        <RaisedButton primary={true} label="Submit" onClick={() => this._createTag()} />
      </div>
    )
  }

  _createTag = async () => {
  const { name } = this.state
  await this.props.createTagMutation({
    variables: {
      name
    }
  })
  this.props.history.push('/')
}

}
const CREATE_TAG_MUTATION = gql`
mutation CreateTagMutation($name:String!){
  createTag(
    name:$name
  ){
    id,
    name
  }
}
`

export default graphql(CREATE_TAG_MUTATION,{name:'createTagMutation'}) (CreateTag)
