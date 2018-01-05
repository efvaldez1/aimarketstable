import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql,compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Link } from 'react-router-dom'

// Material UI
import Card, {CardContent, CardActions, CardHeader} from 'material-ui-next/Card'
//import Avatar from 'material-ui/Avatar';
//import IconButton from 'material-ui/IconButton';
//import Img from 'react-image';
// import CircularProgress from 'material-ui/CircularProgress';
// v 1.0
import { CircularProgress } from 'material-ui-next/Progress';
// import Button from 'material-ui/Button';
// import Button raised from 'material-ui/Button raised';
//v 1.0
import Button from 'material-ui-next/Button';
import TextField from 'material-ui-next/TextField';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui-next/Tabs';

//import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}
//import LinkList from './LinkList'
// copy the UI from Link or ProductPage
class SubmissionPage extends Component {

  state = {
    userId:'',
    newTitle:'',
    newDescription:'',
    newURL:'',
    newCategory:'',
    newAuthor:'',
    showCheckboxes: false,
    selectedProducts:[],
    open:false,
    openConfirm:false,
    link:'',
  }

  handleOpen = (linkId) => {
    console.log('open')
    console.log(linkId)
    this.setState({link:linkId})
    this.setState({open: true});
  };
  handleCloseConfirm = () => {

    this.setState({openConfirm: false});
  };
  handleClose = (linkId) => {

    this.setState({open: false});
  };

  handleConfirm = (linkId) => {
    console.log('open confirm')
    console.log(linkId)
    this.setState({link:linkId})
    this.setState({openConfirm: true});
  };

  handleDelete = (link) => {
    console.log(link)
    this.setState({link})
    this.setState({openConfirm: false});
  };


  isSelected = (id) => {
    console.log("is selected")
    console.log(id)
    return this.state.selectedProducts.indexOf(id) !== -1;
    //return this.state.selectedProducts.push(id);
  };

  handleRowSelection = (selectedRows) => {
    console.log('selected rows')
    console.log(selectedRows)
    this.setState({

      selectedProducts: selectedRows,
    });
  };

  render() {
    // get ID from url params
    const userId = this.props.match.params.id
    const currentUserId = localStorage.getItem(GC_USER_ID)
    console.log(userId)
    console.log(currentUserId )
    if (this.props.findUserQuery && this.props.findUserQuery.loading) {
              return  <div><CircularProgress size={90} thickness={7}/></div>
    }
    if (this.props.findUserQuery && this.props.findUserQuery.error) {
              console.log(this.props.findUserQuery.error)
              return <div>Error</div>
    }
    if (this.props.findUserQuery.User.links.length===0) {
              return  <div>No submissions yet.</div>
    }
    console.log("submission page found")
    const user = this.props.findUserQuery.User
    console.log(this.props.findUserQuery.User)
    var canSelect=false
    if(localStorage.getItem(GC_USER_ID)===user.id){
              canSelect= true
    }
    console.log(canSelect)
    const actionsConfirm = [
      <Button
        color='primary'
        onClick={this.handleCloseConfirm}
      >Cancel</Button>,
      <Button
        color='primary'
      > Delete </ Button>,
    ];
    const actions = [
        <Button
          color='primary'
          onClick={this.handleClose}
        >Cancel</Button>,
        <Button
          color='primary'
          onClick={() => this._updateLink()}
        >Submit</Button>,
      ]
    return (
      <div>
        <div>
        {user.links.map((link,id)=>
          (
            <Card key={link.id}>
            <CardContent>
            <div><strong>Title: </strong> <Link to={'/product/'+link.id} > {link.title}</Link></div>
            <div><strong> Description:</strong> {link.description} </div>
            <div> <strong> URL: </strong> <a href={link.url}>{link.url}</a></div>
            <div> <strong> Category: </strong> {link.category}  </div>
            <div> <strong> No. of Tags: </strong> {link.tags.length||"None"}  </div>
            <div style={styles.wrapper}>
              {link.tags.map((tagItem)=>
                  (
                    <Chip
                    key={tagItem.id}
                    >
                    {tagItem.name}
                    </Chip>
                  )
                )
              }
            </div>
            <div><strong> Submited On:</strong> {link.createdAt} ({timeDifferenceForDate(link.createdAt)})</div>
            <div><strong> Last Updated:</strong> ({timeDifferenceForDate(link.updatedAt)})</div>
            <br/>
            <div className='f6 lh-copy gray'>  {link.votes.length} votes </div>
            <label> Share On: (Not yet implemented) </label>
            <Button > LinkedIn</Button>
            <Button  > Facebook </Button>
            <Button > Twitter</Button>
            </CardContent>
            <CardActions>
            { canSelect &&
              <div>
              <Button raised color='primary'  onClick={() => {
                  this.handleConfirm()
              }}>Delete</Button>
              </div>
            }
            <Dialog
              placeholder="Edit Submision"
              actions={
                <Button
                  color='primary'
                  onClick={this.handleClose}
                >Cancel</Button>,
                <Button
                  color='primary'
                  onClick={() => this._updateLink()}
                >Submit</Button>
              }

              open={this.state.open}
              autoScrollBodyContent={true}
            >
            <div>
            <TextField
              placeholder="Title"
              defaultValue={link.title}
              fullWidth
              onChange={(e) => this.setState({ newTitle: e.target.value })}
            />

            <TextField
              placeholder="Description"
              defaultValue={link.description}

              multiline
              rows={2}

              onChange={(e) => this.setState({ newDescription: e.target.value })}
            />

            <TextField
              placeholder="URL"
              fullWidth
              defaultValue={link.url}
              onChange={(e) => this.setState({ newURL: e.target.value })}
            />

            <TextField
              placeholder="Category"
              fullWidth
              defaultValue={link.category}
              onChange={(e) => this.setState({ newCategory: e.target.value })}
            />

            </div>
            </Dialog>

            <Dialog
              actions={[
                <Button
                  color='primary'
                  onClick={this.handleCloseConfirm}
                >Cancel</Button>,
                <Button
                  color='primary'
                  onClick = {() => this._deleteSubmissions(link.id)}
                >Delete</Button>,
              ]}
              open={this.state.openConfirm}
              onRequestClose={this.confirmClose}
            >
              Are you sure you want to delete "{link.title}" ?
            </Dialog>
            </CardActions>
            </Card>
          )
        )
        }

        </div>
      </div>
    )
  }

  _deleteSubmissions = async(linkId) => {
    // study further component Life Cycle for prop changes
    console.log('del')
    console.log(linkId)

    const link= linkId
    console.log(link)
    await this.props.deleteLinkMutation({
      variables: {
        link
      }

    }
  )
    this.setState({openConfirm: false,})
  }

  _updateLink = async(linkId) => {
    // study further component Life Cycle for prop changes
    console.log('updateLink');
    console.log(linkId)
    var newTitle = ''
    var newDescription = ''
    var newURL = ''
    var newCategory = ''
    if(this.state.newTitle===''){
      newTitle=this.link.title
    }else{
      newTitle=this.state.newTitle
    }
    if(this.state.newDescription===''){
      newDescription=this.link.description
    }else{
      newDescription=this.state.newDescription
    }
    if(this.state.newURL===''){
      newURL=this.link.url
    }else{
      newURL= this.state.newURL
    }
    if(this.state.newCategory===''){
      newCategory=this.link.category
    }else{
      newCategory=this.state.newCategory
    }
    console.log(linkId)
    console.log(newTitle)
    console.log(newDescription)
    console.log(newURL)
    console.log(newCategory)
    await this.props.updateLinkMutation({
      variables: {
        linkId,
        newTitle,
        newDescription,
        newURL,
        newCategory
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
      links{
        id
        title
        url
        description
        category
        updatedAt
        createdAt
        tags{
          id
          name
        }
        offers{
          id
          amount
          comments{
            id
            content
          }
          link{
            id

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
      name
    }
  }
}
`

const DELETE_LINK_MUTATION = gql`
mutation updateLinkMutation ($link: ID!){
  updateLink(id:$link , isDeleted:true){
    id
    title
    isDeleted
    updatedAt
  }
}
`



export default compose(
  graphql(FIND_USER_QUERY, { name: 'findUserQuery' , options: (props) =>({variables:{userId: props.match.params.id}})} ),
  graphql(DELETE_LINK_MUTATION, {name:'deleteLinkMutation'}),
)(SubmissionPage)
