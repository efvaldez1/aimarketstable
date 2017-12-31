import React, { Component } from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID } from '../constants'
// import { withRouter } from 'react-router'
// import { Link } from 'react-router-dom'


// Material UI
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
//<TextField
//  hintText="Enter Amount"
//  value={this.state.amount}
//  onChange={(e) => this.setState({ amount: e.target.value })}
///>

//<TextField
//  hintText="Enter Message"
//  value={this.state.offerdescription}
//  onChange={(e) => this.setState({ offerdescription: e.target.value })}
///>




class CreateComment extends Component {

  state = {
    content: '',
    open:false,
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    console.log("comment section")
    console.log(this.props)
    return (
      <div>
        <div>

          <TextField
            hintText="Enter Comment"
            multiLine={true}
            rows={2}
            rowsMax={5}
            value={this.state.content}
            onChange={(e) => this.setState({ content: e.target.value })}
          />

        </div>

        <RaisedButton primary={true} label="Submit Comment" onClick={() => this._createComment()}/>
        <Snackbar
          open={this.state.open}
          message="Submitted your comment!"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }

  _createComment = async () => {

  const authorId = localStorage.getItem(GC_USER_ID)
  const { content } = this.state
  const offerId= this.props.offerId
  console.log('CreateComment')
  console.log(offerId)
  console.log(content)
  console.log(authorId)
  await this.props.createCommentMutation({
    variables: {
      content,
      offerId,
      authorId
    }
  })

  this.setState({open: true,})

}


}

const CREATE_COMMENT_MUTATION = gql`
mutation CreateCommentMutation($content:String!,$authorId:ID!,$offerId:ID!){
  createComment(
    content:$content
    authorId: $authorId
    offerId:$offerId
  ){
    id
    content
    author
    {
      id
      name
    }
    offer
    {
      id
      amount
      offerdescription
    }
    createdAt
    updatedAt
  }
}
`

export default graphql(CREATE_COMMENT_MUTATION,{name:'createCommentMutation'}) (CreateComment)
