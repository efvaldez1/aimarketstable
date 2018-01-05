import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
//import { timeDifferenceForDate } from '../utils'
import { graphql,compose } from 'react-apollo'
import gql from 'graphql-tag'
//import { Switch, Route, Redirect } from 'react-router-dom'
//import { withRouter } from 'react-router'
//import { Link } from 'react-router-dom'

// Material UI
//follow this format of importing Card!
import Card, { CardActions, CardHeader, CardContent} from 'material-ui-next/Card'
import Avatar from 'material-ui/Avatar';
//import IconButton from 'material-ui/IconButton';
//import Img from 'react-image';
// import CircularProgress from 'material-ui/CircularProgress';
// v 1.0
import { CircularProgress } from 'material-ui-next/Progress';
// import Button from 'material-ui/Button';
// import Button raised from 'material-ui/Button raised';
// v 1.0
import Button from 'material-ui-next/Button';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import SettingsIcon from 'material-ui-icons/Settings';
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
        <Button

          color='primary='
          onClick={this.handleClose}
        >Cancel</Button>,
        <Button

          color='primary'
          onClick={() => this._updateUser()}
        >Submit</Button>,
      ]

      return (
        <div>
        <div>
          <div >
            <Card>
              <CardHeader
                title={user.name}
                subheader={user.position|| "No position or job description yet"}
                avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
              />

              <CardHeader  />
              <CardContent>
                hey
              </CardContent>
              <CardActions>
                <label> Follow On: </label>
                <a href="https://www.graph.cool/docs/reference/graphql-api/mutation-api-ol0yuoz6go/#updating-a-node"><Button> LinkedIn </Button></a>
                <a> <Button >Medium </Button> </a>
                <a> <Button >Twitter </Button> </a>
                <a> <Button >Github </Button> </a>
              </CardActions>
            </Card>
          </div>

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

  var newName = ''
  var newEmail = ''
  var newPosition = ''
  var newAbout = ''
  var newEducation = ''
  if(this.state.newName===''){
    newName=this.props.findUserQuery.User.name
  }else{
    newName=this.state.newName
  }
  if(this.state.newEmail===''){
    newEmail=this.props.findUserQuery.User.email
  }else{
    newEmail=this.state.newEmail
  }
  if(this.state.newPosition===''){
    newPosition=this.props.findUserQuery.User.position
  }else{
    newPosition= this.state.newPosition
  }
  if(this.state.newAbout===''){
    newAbout=this.props.findUserQuery.User.about
  }else{
    newAbout=this.state.newAbout
  }
  if(this.state.newEducation===''){
    newEducation=this.props.findUserQuery.User.education
  }else{
    newEducation=this.state.newEducation
  }
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
