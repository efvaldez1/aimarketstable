import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
//import { timeDifferenceForDate } from '../utils'
import { graphql,compose } from 'react-apollo'
import gql from 'graphql-tag'
//import { Switch, Route, Redirect } from 'react-router-dom'
//import { withRouter } from 'react-router'
//import { Link } from 'react-router-dom'

// Material UI
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar';

import FlatButton from 'material-ui/FlatButton';
//import IconButton from 'material-ui/IconButton';
//import Img from 'react-image';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
//import LinkList from './LinkList'
// copy the UI from Link or ProductPage
class Profile extends Component {
  state = {
    newName:'',
    newAbout:'',
    newEmail:'',
    newPosition:'',
    newEducation:'',

    newTwitter:'',
    newGithub:'',
    newLinkedin:'',
    newMedium:'',

    userId:'',
    showCheckboxes: false,
    selectedProducts:[1],
    open:false,
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  isSelected = (id) => {
    console.log("is selected")
    console.log(id)
    return this.state.selectedProducts.indexOf(id) !== -1;
    //return this.state.selectedProducts.push(id);
  };

  handleRowSelection = (selectedRows) => {
    console.log('selected rows are')
    console.log(selectedRows)
    this.setState({
      selectedProducts: selectedRows,
    });
  };

  render() {
    // get ID from url params
    const userId = this.props.match.params.id
    //const userId = localStorage.getItem(GC_USER_ID)
    console.log(userId)


    if (this.props.findUserQuery && this.props.findUserQuery.loading) {
          return  <div><CircularProgress size={90} thickness={7}/></div>
        }

    if (this.props.findUserQuery && this.props.findUserQuery.error) {
          console.log(this.props.allUsersQuery.error)
          return <div>Error</div>
        }
    //const user ={}
    //all users then traverse till you find specific user
    const user = this.props.findUserQuery.User
    console.log("found")
    console.log(user)
    var canSelect=false
    if(localStorage.getItem(GC_USER_ID)===user.id){
              canSelect= true
    }

    const actions = [
        <FlatButton
          label="Cancel"
          primary={false}
          onClick={this.handleClose}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onClick={() => this._updateUser()}
        />,
      ]

      return (
        <div>
        <div>
        <Tabs>
          <Tab label='Profile'>
          <div >
            <Card>
              <CardHeader
                title={user.name}
                subtitle={user.position|| "No position or job description yet"}
                avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
              />
              <CardTitle  />
              <CardText>
                <div>{user.about || "No description yet"}</div>
                <br/>
                <div> Email : {user.email} </div>
                <div>Education : {user.education|| "N/A"}</div>
                <div> No.Of Products Submitted : {user.links.length||"N/A"} </div>
                <div> No. Of Offers Created : {user.offers.length||"N/A"} </div>
                <RaisedButton primary={true} label="Edit Profile" onClick={this.handleOpen} />

                <Dialog
                  title="Edit Submision"
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  autoScrollBodyContent={true}
                >

                <TextField
                  floatingLabelText="Name"
                  defaultValue={user.name}
                  fullWidth={true}
                  onChange={(e) => this.setState({ newName: e.target.value })}
                />

                <TextField
                  floatingLabelText="Email"
                  defaultValue={user.email}
                  fullWidth={true}
                  onChange={(e) => this.setState({ newEmail: e.target.value })}
                />

                <TextField
                  floatingLabelText="Job Description or Position"
                  defaultValue={user.position}
                  fullWidth={true}
                  onChange={(e) => this.setState({ newPosition: e.target.value })}
                />

                <TextField
                  floatingLabelText="About"
                  multiLine={true}
                  rows={2}
                  rowsMax={4}
                  defaultValue={user.about}
                  onChange={(e) => this.setState({ newAbout: e.target.value })}
                />

                <TextField
                  floatingLabelText="Education"
                  fullWidth={true}
                  defaultValue={user.education}
                  onChange={(e) => this.setState({ newEducation: e.target.value })}
                />

                </Dialog>
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
          </Tab>


        </Tabs>
        </div>
        </div>
      )
  }


_deleteSubmissions = async () => {

  console.log("del submission")
  console.log(this.state.selectedProduct)
  console.log(this.props.findUserQuery.User.links)
  const linkId = this.props.findUserQuery.User.links[this.state.selectedProducts[0]]

  await this.props.deleteLinkMutation({
    variables: {
      linkId
    }
  })
  console.log('done')
  console.log(linkId)
}

  _updateUser = async () => {
  console.log('update user')

  const userId = this.props.findUserQuery.User.id
  const {newName,newEmail,newPosition,newAbout,newEducation } = this.state
  console.log("vars")
  console.log(userId)
  console.log(newName)
  console.log(newEmail)
  console.log(newAbout)
  console.log(newEducation)
  console.log(newPosition)
  await this.props.updateUserMutation({
    variables: {
      userId,
      newName,
      newEmail,
      newAbout,
      newEducation,
      newPosition
    }
  }

  )
  this.setState({open: false,})
  }

}


const FIND_USER_QUERY = gql`
   query FindUserQuery($userId: ID) {
     User(id: $userId) {
      id
      name
      email
      createdAt
      updatedAt
      about
      education
      position
      offers{
        id
        amount
        createdAt
        updatedAt
      }
      links{
        id
        title
        offers{
          id
          amount
          createdAt
          updatedAt
          offerdescription
          offerBy{
            id
            name
          }
          comments{
            id
            content
            createdAt
            updatedAt
            author{
              id
              name
            }
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
mutation updateUserMutation ($userId:ID! , $newName:String , $newPosition:String , $newEmail:String ,$newAbout:String , $newEducation:String){
    updateUser(id: $userId , name:$newName , position: $newPosition, email:$newEmail , about:$newAbout,education:$newEducation) {
      id
      name
      email
      about
      education
      position
      updatedAt
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
      updatedAt
      about
      education
      position
      github
      twitter
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
  graphql(FIND_USER_QUERY, { name: 'findUserQuery' , options: (props) =>({variables:{userId: props.match.params.id}})} ),

  graphql(UPDATE_USER_MUTATION, { name: 'updateUserMutation' }),
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
