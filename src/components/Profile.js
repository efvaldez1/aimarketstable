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
import Img from 'react-image'
import CircularProgress from 'material-ui/CircularProgress';

class Profile extends Component {
  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    console.log('userId')
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
  console.log("links")


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
              <div> Email : {user.email} </div>
              <div> No.Of Products Submitted : {user.links.length||"N/A"} </div>
              <div> No. Of Offers Created : {user.offers.length||"N/A"} </div>
            </CardText>
            <CardActions>
              <label> Follow On: </label>
              <FlatButton label="LinkedIn" />
              <FlatButton label="Medium" />
              <FlatButton label="Twitter" />
              <FlatButton label="Github" />
            </CardActions>
          </Card>

        </div>
        <div>
          Products:
          <Table>
            <TableHeader>
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
            <TableBody>
              {user.links.map((link,id)=>
                (
                  <TableRow>
                    <TableRowColumn> {link.id}</TableRowColumn>
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
  graphql(FIND_USER_QUERY, { name: 'findUserQuery' })
)(Profile)
