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
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';

// modals
//import EditProductModal from 'EditProductModal';
//import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: 14,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  header:{
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
  },
  paragraph: {
    margin:20,
    textIndent:30,
    fontStyle: 'italic',
    paddingLeft: 30,
    textAlign: 'justify',
  },
  button: {
    margin: 5,

  },
}

const styles2 = theme => ({

  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});
//import LinkList from './LinkList'
// copy the UI from Link or ProductPage
class SubmissionPage extends Component {
  constructor() {
    super();
    this.state = {
      userId:'',
      newTitle:'',
      newDescription:'',
      newURL:'',
      newCategory:'',
      newAuthor:'',
      showCheckboxes: false,
      selectedProducts:[],
      openEdit:false,
      openConfirm:false,
      link:'',
    }
    this.baseState = this.state

  }


  componentDidMount() {
      this._subscribeToUpdatedLinks()

    }


  handleReset = () => {
    console.log("resetting states")
    this.setState(this.baseState)
    console.log(this.state)
  }
  handleEdit = (link) => {
    console.log('link to edit')
    console.log(link)
    this.setState({link:link})
    this.setState({openEdit: true});
  };
  handleCloseConfirm = () => {

    this.setState({openConfirm: false});
  };
  handleEditClose = (linkId) => {

    this.setState({openEdit: false});
  };

  handleConfirm = (link) => {
    console.log(' handle confirm')
    console.log(link)
    this.setState({openConfirm: true,link:link});

  };

  handleDelete = (link) => {
    console.log("handle delete")
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
    console.log('current state')
    console.log(this.state)
    const userId = this.props.match.params.id
    const currentUserId = localStorage.getItem(GC_USER_ID)
    console.log(userId)
    console.log(currentUserId)
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
    console.log(this.props.findUserQuery.User.links)
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
          onClick={this.handleEditClose}
        >Cancel</Button>,
        <Button
          color='primary'
          onClick={() => this._updateLink()}
        >Submit</Button>,
      ]
    return (
      <div>
        <div>
        {
          user.links.map((link,id)=>
          (
            <Card key={link.id}>
            <CardContent>

            <div style={styles.header}> <Link to={'/product/'+link.id} > {link.title}</Link></div>
            <div style={styles.paragraph}>{link.description} </div>
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
            <div><strong> Submited On:</strong> {link.createdAt.slice(0,10)} ({timeDifferenceForDate(link.createdAt)})</div>
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
              <Button raised  color='default' onClick={() => {this.handleEdit(link)}}> Edit<EditIcon></EditIcon> </Button>
              <Button raised color='accent' style={{color:'black',margin:10 , background:'red'}} onClick={() => {this.handleConfirm(link)}}>Delete <DeleteIcon></DeleteIcon> </Button>
              </div>
            }
            </CardActions>
            </Card>
          )
        )
        }
        <Dialog
          title="Edit Submision"
          actions={
            [
            <Button
            raised
            onClick={this.handleEditClose}
            >Cancel</Button>,
            <Button
            raised
              color='primary'
              onClick={() => this._updateLink(this.state.link.id)}
            >Submit</Button>]
          }
          modal={false}
          open={this.state.openEdit}
          autoScrollBodyContent={true}
        >
        <div>
        <TextField
          label="Title"
          defaultValue={this.state.link.title}
          fullWidth
          onChange={(e) => this.setState({ newTitle: e.target.value })}
        />

        <TextField
          label="Description"
          defaultValue={this.state.link.description}
          fullWidth
          multiLine={true}
          rows={2}
          rowsMax={4}
          onChange={(e) => this.setState({ newDescription: e.target.value })}
        />

        <TextField
          label="URL"
          fullWidth
          defaultValue={this.state.link.url}
          onChange={(e) => this.setState({ newURL: e.target.value })}
        />

        <TextField
          label="Category"
          fullWidth
          defaultValue={this.state.link.category}
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
                  onClick = {() => this._deleteSubmissions(this.state.link.id)}
                >Delete</Button>,
              ]}xx
              open={this.state.openConfirm}
              onRequestClose={this.confirmClose}
            >
              Are you sure you want to delete "{this.state.link.title}"?
          </Dialog>


        </div>
      </div>
    )
  }

  _deleteSubmissions = async(linkId) => {
    // study further component Life Cycle for prop changes
    console.log('del')
    const link= linkId
    console.log(link)
    await this.props.deleteLinkMutation({
      variables: {
        link
      }

    }
  )
    this.setState({openConfirm: false,})
    window.location.reload();
  }

  _subscribeToUpdatedLinks = () => {
    console.log("UPDATE USER LINKS SUBS")
    this.props.findUserQuery.subscribeToMore({
      document: gql`
        subscription {
          User(id: $id, filter: {
            mutation_in: [UPDATED]

          }) {
            node {
              id
              name
              email
              createdAt
              links(filter:{isDeleted:false}){
                id
                title
                url
                description
                category
                isDeleted
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
            updatedFields
            previousValues{
              name
              email
              links{
                isDeleted
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        console.log("previous")
        console.log(previous)
        console.log('subdata')
        console.log(subscriptionData)
        const updatedLinkIndex = previous.User.links.findIndex(link => link.id === subscriptionData.data.Link.node.id)
        const link = subscriptionData.data.Link.node
        const newAllLinks = previous.allLinks.slice()
        newAllLinks[updatedLinkIndex] = link
        const result = {
          ...previous,
          allLinks: newAllLinks
        }

        return result
      }
    })
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
      newTitle=this.state.link.title
    }else{
      newTitle=this.state.newTitle
    }
    if(this.state.newDescription===''){
      newDescription=this.state.link.description
    }else{
      newDescription=this.state.newDescription
    }
    if(this.state.newURL===''){
      newURL=this.state.link.url
    }else{
      newURL= this.state.newURL
    }
    if(this.state.newCategory===''){
      newCategory=this.state.link.category
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
    this.handleReset()
  }

}



const FIND_USER_QUERY = gql`
query FindUserQuery($userId: ID) {
    User(id: $userId) {
      id
      name
      email
      createdAt
      links(filter:{isDeleted:false}){
        id
        title
        url
        description
        category
        isDeleted
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


const UPDATE_LINK_MUTATION = gql`
mutation updateLinkMutation($linkId:ID! , $newTitle:String! , $newDescription:String! , $newURL: String! , $newCategory:String!){
updateLink(
  id:$linkId
  title:$newTitle
  description:$newDescription
  url:$newURL
  category:$newCategory
)
  {
    id
    title
    description
    url
    category
    updatedAt
  }

}`

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
  graphql(UPDATE_LINK_MUTATION, {name: 'updateLinkMutation'}),
)(SubmissionPage)
