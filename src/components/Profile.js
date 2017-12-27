import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql,compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

// Material UI
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Img from 'react-image';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class Profile extends Component {
  state = {
    newName:'',
    newEmail:'',
    userId:'',
    showCheckboxes: false,
    selectedProducts:[]
  }
  isSelected = (id) => {
    console.log(id)
    return this.state.selectedProducts.push(id);
  };

  handleRowSelection = (selectedRows) => {
    console.log(selectedRows)
    this.setState({

      selectedProducts: selectedRows,
    });
  };

  render() {
    console.log("RENDER")
    // get ID from url params
    const userId = this.props.match.params.id
    //const userId = localStorage.getItem(GC_USER_ID)
    console.log(userId)




    if (this.props.allUsersQuery && this.props.allUsersQuery.loading) {
    return  <div><CircularProgress size={90} thickness={7}/></div>
  }

  if (this.props.allUsersQuery && this.props.allUsersQuery.error) {
    console.log(this.props.allUsersQuery.error)
    return <div>Error</div>
  }
  //const user ={}
  //all users then traverse till you find specific user
  const result = this.props.allUsersQuery.allUsers
  console.log(result)
  const len = result.length
  console.log("len")
  console.log(len)
  for (var i = 0; i < len; i++) {
   if(result[i].id===userId)
  {
    console.log("hey")
    console.log(result[i])
    var user = result[i]
   }
  }



  console.log("found")
  console.log(user)
  var canSelect=false
  if(localStorage.getItem(GC_USER_ID)===user.id){
            console.log("if")
            console.log(userId)
            console.log(user.id)
            canSelect= true
  }
  console.log(canSelect)
  console.log("update email and name")

      return (
        <div>
        <div >

          <Card>
            <CardHeader
              title={user.name}
              subtitle="User's Position"
              avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
            />
            <CardTitle title="About" />
            <CardText>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.</div>
              <br/>
              <div>ID : {user.id}</div>
              <div>Name : {user.name}</div>
              <TextField
                hintText={user.name}
                value={this.state.newName}
                onChange={(e) => this.setState({ newName: e.target.value })}
              />

              <TextField
                hintText={user.email}
                value={this.state.newEmail}
                onChange={(e) => this.setState({ newEmail: e.target.value })}
              />
              <div>New Name: {this.state.newName}</div>
              <div>New Email: {this.state.newEmail}</div>
              <div> Email : {user.email} </div>
              <div> No.Of Products Submitted : {user.links.length||"N/A"} </div>
              <div> No. Of Offers Created : {user.offers.length||"N/A"} </div>
              <RaisedButton primary={true} label="Update Profile" onClick={() => this._updateUser()} />
            </CardText>
            <CardActions>
              <label> Follow On: </label>
              <a href="https://www.graph.cool/docs/reference/graphql-api/mutation-api-ol0yuoz6go/#updating-a-node"><FlatButton label="LinkedIn"> </FlatButton></a>
              <a> <FlatButton label="Medium" /> </a>
              <a> <FlatButton label="Twitter" /> </a>
              <a> <FlatButton label="Github" /> </a>
            </CardActions>
          </Card>

        </div>
        <div>
          <strong> Submissions: </strong>
          <Table selectable={canSelect} displaySelectAll={canSelect} multiSelectable={canSelect}>
            <TableHeader adjustForCheckbox={canSelect} >
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Title</TableHeaderColumn>
                <TableHeaderColumn>Category</TableHeaderColumn>

                <TableHeaderColumn>Date Created</TableHeaderColumn>
                <TableHeaderColumn>Last Updated</TableHeaderColumn>
                <TableHeaderColumn>No. Of Votes</TableHeaderColumn>
                <TableHeaderColumn>No. Of Offers</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody >
              {user.links.map((link,id)=>
                (
                  <TableRow key={link.id}>
                    <TableRowColumn> <Link to={'/product/'+link.id} > {link.id}</Link></TableRowColumn>
                    <TableRowColumn> {link.title}</TableRowColumn>
                    <TableRowColumn> {link.category || 'NA'}</TableRowColumn>
                    <TableRowColumn> {link.createdAt}</TableRowColumn>
                    <TableRowColumn> {link.updatedAt}</TableRowColumn>
                    <TableRowColumn> {link.votes.length || "0"}</TableRowColumn>
                    <TableRowColumn> {link.offers.length || "0"}</TableRowColumn>

                  </TableRow>
                ) || 'N/A'
              )
              }
            </TableBody>
          </Table>

        </div>
        </div>
      )
  }

  _updateUser = async () => {
  const userId = localStorage.getItem(GC_USER_ID)
  const { newName, newEmail } = this.state
  console.log("vars")
  console.log(newName)
  console.log(newEmail)
  //const {newName,newEmail } = this.state
  //const userId= this.user.id
  console.log(newName)
  console.log(newEmail)
  console.log(userId)
  await this.props.updateUserMutation({
    variables: {
      userId,
      newName,
      newEmail
    }
  }

  )
  console.log('done')
  }




}

// why wont findUseQuery(ID) wont work
const FIND_USER_QUERY = gql`
  query FindUserQuery($userId: ID) {
    User(id: $userId) {
      id
      name
      email
      createdAt
      links{
        id
        title
        offers{
          id
          amount
          comments{
            id
            content
          }
        }
        votes{
          id
        }
      }

    }
  }
`

const UPDATE_USER_MUTATION = gql`
mutation updateUserMutation ($userId:ID! , $newName:String! , $newEmail:String! ){
    updateUser(id: $userId , name:$newName , email:$newEmail) {
      id
      name
      email
      createdAt
      links{
        id
        title
        offers{
          id
          amount
          comments{
            id
            content
          }
        }
        votes{
          id
        }
      }

    }
  }
`


const UPDATE_LINK_QUERY = gql`
mutation UpdateLinkQuery($id:ID! $newTitle:String! $newDescription:String! $newUrl:String!){
  updateLink(
    id:$id
    title: $newTitle
    description:$newDescription
    url: $newUrl
  ){
    id
    title
    description
    url
    category
    createdAt
    updatedAt
    postedBy{
      id
      name
    }
    votes{
      id
    }
    offers{
      id
    }
    tags{
      id
    }
  }
}
`

const ALL_USERS_QUERY = gql`
  query AllUsersQuery{
    allUsers {
      id
      name
      email
      createdAt

      offers{
        id
        amount
      }
      links{
        id
        title
        url
        description
        createdAt
        updatedAt
        votes{
          id
        }
        offers{
          id
          amount
          comments{
            id
            content
          }
        }

      }
    }
  }
`
//how to make single queries work
//export default graphql(USER_QUERY,{name:'findUserQuery'}) (Profile)
export default compose(
  graphql(ALL_USERS_QUERY, {name:'allUsersQuery'}),
  graphql(FIND_USER_QUERY, { name: 'findUserQuery' }),
    graphql(UPDATE_USER_MUTATION, { name: 'updateUserMutation' })
)(Profile)


//Ref
//https://dev-blog.apollodata.com/tutorial-graphql-input-types-and-client-caching-f11fa0421cfd
//https://reactjs.org/docs/react-component.html
//https://www.graph.cool/docs/reference/graphql-api/mutation-api-ol0yuoz6go#updating-a-node






//componentWillMount
// componentWillMount(){
//   const userId = localStorage.getItem(GC_USER_ID)
//   console.log('userId')
//   console.log(userId)
//
//   if (this.props.allUsersQuery && this.props.allUsersQuery.loading) {
//   return  console.log("loading")
//   }
//
//   if (this.props.allUsersQuery && this.props.allUsersQuery.error) {
//     console.log(this.props.allUsersQuery.error)
//     return console.log("error")
//   }
//
//   const result = this.props.allUsersQuery.allUsers
//   console.log(result)
//   const len = result.length
//   console.log(len)
//   for (var i = 0; i < len; i++) {
//    if(result[i].id===userId)
//   {
//     console.log(result[i])
//     var user = result[i]
//    }
//   }
// console.log("found")
// console.log(user)
// this.setState({newName: user.name})
// this.setState({newEmail: user.email})
// console.log("END MOUNT")
// }
