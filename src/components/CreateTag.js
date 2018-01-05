import React, { Component } from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
// Material UI
import TextField from 'material-ui-next/TextField';
//import Button from 'material-ui/Button';
import Button from 'material-ui-next/Button';
class CreateTag extends Component {
  state = {
    name:'',
    description:''
  }

  render() {
    return (
      <div>
        <div className='flex flex-column mt3  '>
          <TextField
            placeholder="Title for Tag"
            fullwidth="false"
            value = {this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          ></TextField>
          <br/>


        </div>


        <Button raised color='primary' onClick={() => this._createTag ()}> Submit </Button >
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
