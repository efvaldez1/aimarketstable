import React, { Component } from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

//Material UI
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class CreateCategory extends Component {

  state = {
    name:''
  }

  render() {
    return (
      <div>
        <div className='flex flex-column mt3'>

          <TextField
            hintText="Enter Title Of Category"
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          /><br />

        </div>


        <RaisedButton primary={true} label="Submit Category" onClick={() => this._createCategory ()} />
      </div>
    )
  }

  _createCategory = async () => {
  const { name } = this.state
  await this.props.createCategoryMutation({
    variables: {
      name
    }
  })
  this.props.history.push('/')
}

}
const CREATE_CATEGORY_MUTATION = gql`
mutation CreateCategoryMutation($name:String!){
  createCategory(
    name:$name
  ){
    id
    name
  }
}
`

export default graphql(CREATE_CATEGORY_MUTATION,{name:'createCategoryMutation'}) (CreateCategory)
