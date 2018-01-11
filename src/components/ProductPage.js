import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql,compose } from 'react-apollo'
import gql from 'graphql-tag'
import CreateComment from './CreateComment'
import CreateOffer from './CreateOffer'



// Material UI
import Card, {CardMedia, CardHeader,CardActions, CardContent } from 'material-ui-next/Card';
import Avatar from 'material-ui/Avatar';
//import IconButton from 'material-ui/IconButton';
// import CircularProgress from 'material-ui/CircularProgress';
// v 1.0
import { CircularProgress } from 'material-ui-next/Progress';
//import Img from 'react-image'
//React-PDF
//import { Document, Page } from 'react-pdf';
// import Button from 'material-ui/Button';
// import Button raised from 'material-ui/Button raised';
//v 1.0
import Button from 'material-ui-next/Button';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
//import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import DeleteIcon from 'material-ui-icons/Delete';
import SettingsIcon from 'material-ui-icons/Settings';
import EditIcon from 'material-ui-icons/Edit';
import Chip from 'material-ui-next/Chip';
import { Link } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import Icon from 'material-ui-next/Icon';
import FaFacebookSquare from 'react-icons/lib/fa/facebook-square'
import FaGithub from 'react-icons/lib/fa/github'
import FaLinkedinSquare from'react-icons/lib/fa/linkedin-square'
import FaMedium from 'react-icons/lib/fa/medium'
import FaTwitterSquare from 'react-icons/lib/fa/twitter-square'
import GoMarkGithub from 'react-icons/lib/go/mark-github'
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
}

class ProductPage extends Component {
  constructor() {
    super();
    this.state = {
      link:{},
      newTitle:'',
      newDescription:'',
      newURL:'',
      newCategory:'',
      newAuthor:'',
      open: false,
      openComment:false,
      openOffer:false,
      newAmount: '',
      newOfferDescription: '',
      newContent: '',
    }
    this.baseState = this.state
  }

  componentDidMount() {
    this._subscribeToNewOffers()
    this._subscribeToNewComments()
    this._subscribeToUpdatedLinks()
  }

  resetState = () => {
    console.log('reset state!')
    console.log(this.state)
    console.log(this.baseState)
    this.setState(this.baseState)
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };


  render() {
    console.log("base state")
    console.log(this.baseState)
    const actions = [
      <Button
        color='primary'
        onClick={this.handleClose}
      >Cancel</Button>,
      <Button raised
        color='primary'
        onClick={() => this._updateLink()}
      >Submit</Button>,
    ]

    const editOfferActions = [
      <Button
        color='primary'
        onClick={() => this.setState({openOffer:false})}
      >Cancel</Button>,
      <Button raised
        color='primary'
        onClick={() => this._updateLink()}
      >Update Offer</Button>,
    ]

    const editCommentActions = [
      <Button
        color='primary'
        onClick={() => this.setState({openComment:false})}
      >Cancel</Button>,
      <Button raised
        color='primary'
        onClick={() => this._updateLink()}
      >Update Comment</Button>,
    ]

    if (this.props.findLinkQuery && this.props.findLinkQuery.loading) {
      return <div><CircularProgress size={90} thickness={7}/></div>
    }

    if (this.props.findLinkQuery && this.props.findLinkQuery.error) {
      console.log(this.props.findLinkQuery.error)
      return <div>Error</div>
    }
    //const id = this.props.match.params.id
    const link = this.props.findLinkQuery.Link
    console.log("Ids of user")
    const userId = localStorage.getItem(GC_USER_ID)
    console.log("Id of author of product")
    console.log(this.props.findLinkQuery.Link.postedBy.id)
    console.log(userId)
    let  EditButton=null
    let DeleteOfferButton = null
    let UpdateOfferButton = null
    let UpdateCommentButton = null
    let DeleteCommentButton = null
    //if(link.postedBy.id===userId) {
    //    console.log("can edit offer")
    //    console.log()
        EditButton = <Button raised  onClick={this.handleOpen} > Edit Submission<EditIcon></EditIcon> </Button>
        DeleteOfferButton  = <Button onClick={() => this.setState({openOffer:true}) }>Delete <DeleteIcon></DeleteIcon> </Button>
        UpdateOfferButton  = <Button onClick={() => this.setState({openOffer:true}) }>Edit Offer<EditIcon></EditIcon> </Button>
        UpdateCommentButton  = <Button onClick={() => this.setState({openComment:true}) }>Edit Comment<EditIcon></EditIcon> </Button>
        DeleteCommentButton = <Button onClick={() => this.setState({openOffer:true}) }>Delete<DeleteIcon></DeleteIcon> </Button>
    //}

    return (
      <div>
      <Card>
      <CardHeader
        title={link.postedBy.name}

        subheader={link.postedBy.position ?link.postedBy.position : "No job description yet"}
        avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
      />
      <CardMedia

            title={link.title}
            >
            <img src="http://americanconstruction.net/wp-content/uploads/2015/10/upload-empty.png" alt="" />
      </CardMedia>
      <CardContent>
      <div style={styles.header}>{link.title}</div>
      <div style={styles.paragraph}>{link.description}</div>
      <br/>
      <div> <strong> URL: </strong><a href={link.url}>{link.url}</a></div>
      <div> <strong> Category: </strong> {link.category || 'None'}</div>
      <div> <strong> Submitted On: </strong> {link.createdAt.slice(0,10)} ({timeDifferenceForDate(link.createdAt)}) </div>
      <div> <strong> Last updated at: </strong> {link.updatedAt.slice(0,10)} ({timeDifferenceForDate(link.updatedAt)}) </div>
      <div style={styles.wrapper}> <strong> Tags: </strong>
          {link.tags.length!==0 ? link.tags.map((tagItem)=>
          (<Chip  style={styles.chip} label={tagItem.name}>{tagItem.name} </Chip>)
        ) : 'None'
          }
      </div>
      <div> <strong> No. Of Offers: </strong> {link.offers.length||"N/A"} </div>
      <div className='f6 lh-copy gray'>{link.votes.length} votes </div>
      <div>
      {(link.postedBy.id===userId)? EditButton : null}
        <Dialog
          title="Edit Submision"
          actions={actions}
          modal={false}
          open={this.state.open}
          autoScrollBodyContent={true}
        >
        <div>

        <TextField
          floatingLabelText="Title"
          defaultValue={link.title}
          fullWidth={true}
          onChange={(e) => this.setState({ newTitle: e.target.value })}
        />

        <TextField
          floatingLabelText="Description"
          defaultValue={link.description}
          fullWidth={true}
          multiLine={true}
          rows={2}
          rowsMax={4}
          onChange={(e) => this.setState({ newDescription: e.target.value })}
        />

        <TextField
          floatingLabelText="URL"
          fullWidth={true}
          defaultValue={link.url}
          onChange={(e) => this.setState({ newURL: e.target.value })}
        />

        <TextField
          floatingLabelText="Category"
          fullWidth={true}
          defaultValue={link.category}
          onChange={(e) => this.setState({ newCategory: e.target.value })}
        />

        </div>
        </Dialog>
      </div>
      <br/>
    </CardContent>
        <CardActions>
        <div>

        <strong> Share :</strong>

          <Button style={styles.button } href={"https://www.facebook.com/sharer/sharer.php?u=https://intuitionmarket.herokuapp.com/product/"+link.id} > <FaFacebookSquare styles={styles.rightIcon}/></Button>
          <Button style={styles.button } href={"https://twitter.com/share?url=https://intuitionmarket.herokuapp.com/product/"+link.id+"&hashtag=IntuitionMarket"} ><FaTwitterSquare styles={styles.rightIcon}/> </Button>
          <Button style={styles.button } href={"https://linkedin.com/shareArticle?mini=true&url=https://intuitionmarket.herokuapp.com/product/"+link.id} > <FaLinkedinSquare styles={styles.rightIcon}/></Button>

        </div>
        <div>
          <label>  <strong>  Links: </strong> </label>
            <Button style={styles.button } href={"https://github.com/IntuitionMachine"} > <GoMarkGithub styles={styles.rightIcon}/></Button>
        </div>
        </CardActions>
    </Card>
    <div>
    <br/>
    <div>
      {userId &&
        <Card>
        <CardContent>
        <CreateOffer linkId={link.id}/>
        <br/>
        </CardContent>
        </Card>
      }
      <div>
      <br/>
      <label><strong>Offers :</strong></label>
      {link.offers.map((offerItem)=>(
        <div key={offerItem.id}>
        <Dialog
          title="Edit Offer"
          actions={
            [
              <Button
                color='primary'
                onClick={() =>
                  {
                    this.resetState()
                  }
              }
              >Cancel</Button>,
              <Button raised
                color='primary'
                onClick={() => this._updateOffer(offerItem.id)}
              >Update Offer</Button>,
            ]
          }
          modal={false}
          open={this.state.openOffer}
          autoScrollBodyContent={true}
        >
        <div>
        <div><label><strong>ID: </strong></label>{offerItem.id}</div><br/>
        <TextField
          floatingLabelText="Amount"
          defaultValue={offerItem.amount}
          onChange={(e) => this.setState({ newAmount: e.target.value })}
        />

        <TextField
          floatingLabelText="Offer Description"
          defaultValue={offerItem.offerdescription}
          fullWidth={true}
          multiLine={true}
          rows={2}
          rowsMax={4}
          onChange={(e) => this.setState({ newOfferDescription: e.target.value })}
          />
        </div>
        </Dialog>
        <Card key={offerItem.id}>
          <CardHeader
            title={offerItem.offerBy.name}
            subheader={offerItem.offerBy.position? offerItem.offerBy.position : "No job description or position yet"}
            avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
            action={(offerItem.offerBy.id===userId)? [UpdateOfferButton , DeleteOfferButton]:null}
          />
          <CardContent>
              <div>
              <div>Amount: {offerItem.amount}</div>
              <a>Description: {offerItem.offerdescription}</a><br/>
              <div className='f6 lh-copy gray'>
                <a><strong> Created: </strong>{timeDifferenceForDate(offerItem.createdAt)} </a><br/>
              </div>
              <Divider />
              <label><strong>Comments : </strong></label>
              {offerItem.comments.map((commentItem)=>
                (
                  <div key={commentItem.id}>
                  <Dialog
                    title="Edit Comment"
                    actions={
                      [
                        <Button
                          color='primary'
                          onClick={() =>
                        {
                          this.setState({openComment:false})
                          this.resetState()}
                        }

                        >Cancel</Button>,
                        <Button raised
                          color='primary'
                          onClick={() => this._updateComment(commentItem.id)}
                        >Update Comment</Button>,
                      ]
                    }
                    modal={false}
                    open={this.state.openComment}
                    autoScrollBodyContent={true}
                  >
                  <div>
                  <TextField
                    floatingLabelText="Content"
                    fullWidth={true}
                    multiLine={true}
                    rows={2}
                    rowsMax={4}
                    defaultValue={commentItem.content}
                    onChange={(e) => this.setState({ newContent: e.target.value })}
                  />

                  </div>
                  </Dialog>
                  <Card >
                    <CardHeader
                      title={commentItem.author.name}
                      subheader={commentItem.author.position? commentItem.author.position : "No job description or position yet"}
                      avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
                      action={(commentItem.author.id===userId)? [UpdateCommentButton , DeleteCommentButton]:null}
                    />
                    <CardContent>
                        <div>
                        <a>{commentItem.content}</a>
                        <br/>

                        <div className='f6 lh-copy gray'>
                          <a> Created: {timeDifferenceForDate(commentItem.createdAt)}</a><br/>
                        </div>

                        <br/>
                        </div>
                    </CardContent>
                  </Card>
                  </div>
                )
              )
              }
              </div>
          </CardContent>
          <CardActions>
          {userId &&
          <CreateComment offerId={offerItem.id} productId={link.id}/>
          }
          </CardActions>
        </Card>
        <br/>
        </div>
      )
      )
      }

      </div>
    </div>
    </div>

    </div>

    )
  }


  _updateOffer = async(linkId) => {
    // study further component Life Cycle for prop changes
    console.log('update offer!')
    const link= linkId
    const {newAmount, newOfferDescription} = this.state
    console.log(link)
    console.log(newAmount)
    console.log(newOfferDescription)
    await this.props.updateOfferMutation({
      variables: {
        link ,
        newAmount ,
        newOfferDescription,
      }

    }
  )
    console.log('reset')
    console.log(this.state)
    console.log(this.baseState)
    this.setState(this.baseState)

  }

  _updateComment = async(linkId) => {
    // study further component Life Cycle for prop changes
    console.log('update comment')
    const link= linkId
    const {newContent} = this.state
    console.log(link)
    console.log(newContent)
    await this.props.updateCommentMutation({
      variables: {
        link ,
        newContent,
      }

    }
  )
    this.setState({openCommenet: false,})
  }

  _updateLink = async() => {
    // study further component Life Cycle for prop changes
    var linkId = this.props.findLinkQuery.Link.id
    var newTitle = ''
    var newDescription = ''
    var newURL = ''
    var newCategory = ''

    if(this.state.newTitle===''){
      newTitle=this.props.findLinkQuery.Link.title
    }else{
      newTitle=this.state.newTitle
    }
    if(this.state.newDescription===''){
      newDescription=this.props.findLinkQuery.Link.description
    }else{
      newDescription=this.state.newDescription
    }
    if(this.state.newURL===''){
      newURL=this.props.findLinkQuery.Link.url
    }else{
      newURL= this.state.newURL
    }
    if(this.state.newCategory===''){
      newCategory=this.props.findLinkQuery.Link.category
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
    this.resetState()
  }


  _deleteOffer = async(linkId) => {
    console.log('delete offer')
    console.log(linkId)
    const link= linkId
    console.log(link)
    await this.props.deleteOfferMutation({
      variables: {
        link
      }
    }
  )
    this.setState({openConfirm: false,})
  }


  _deleteComment = async(linkId) => {
    console.log('delete comment')
    console.log(linkId)
    const link= linkId
    console.log(link)
    await this.props.deleteCommentMutation({
      variables: {
        link
      }
    }
  )
    this.setState({openConfirm: false,})
  }

  _subscribeToUpdatedLinks= () => {
    //
  }
  _subscribeToNewOffers = () => {
    console.log("OFFER SUBS")
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Offer(filter: {
              mutation_in: [CREATED, UPDATED, DELETED]
          }) {
            node {
              id
              amount
              offerdescription
              link{
                id
                title
                url
                category
                postedBy{
                  id
                  name
                }
                description
                votes{
                  id
                }
                offers{
                  id
                  amount
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
                tags{
                  id
                  name
                }
                createdAt
                updatedAt
              }
              offerBy{
                id
                name
              }
              createdAt
              updatedAt
              comments{
                id
                content
                updatedAt
                createdAt
                offer{
                  id
                  amount
                  offerdescription
                  offerBy{
                    id
                    name
                  }
                  link{
                    id
                    title
                    category
                    url
                    tags{
                      id
                      name
                    }
                    offers{
                      id
                      amount
                      offerdescription
                      createdAt
                      updatedAt
                    }
                    createdAt
                    updatedAt
                    postedBy{
                      id
                      name
                    }
                    votes{
                      id
                    }
                  }
                }
                author{
                  id
                  name
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
      const offeredLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Offer.node.link.id)
      const link = subscriptionData.data.Offer.node.link
      const newAllLinks = previous.allLinks.slice()
      newAllLinks[offeredLinkIndex] = link
      const result = {
          ...previous,
          allLinks: newAllLinks
      }
      return result
      }
    })
  }

  _subscribeToNewComments = () => {
    console.log("COMMENT SUBS")
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Comment(filter: {
              mutation_in: [CREATED, UPDATED, DELETED]
          }) {
            node {
              id
              content
              offer{
                id
                offerdescription
                offerBy{
                  id
                  name
                }
                comments{
                  id
                  content
                  author{
                    id
                    name
                  }
                  createdAt
                  updatedAt
                }
                updatedAt
                createdAt
                link{
                  id
                  title
                  createdAt
                  url
                  description
                  category
                  tags{
                    id
                    name
                  }
                  postedBy{
                    id
                    name
                  }
                  votes{
                    id
                  }
                  offers{
                    id
                    amount
                    offerdescription
                    offerBy{
                      id
                      name
                    }
                    comments{
                      id
                      content
                      author{
                        id
                        name
                      }
                      createdAt
                      updatedAt
                    }
                  }
                }
              }
              author{
                id
                name
              }
              createdAt
              updatedAt
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const commentedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Comment.node.offer.link.id)
        const link = subscriptionData.data.Comment.node.offer.link
        const newAllLinks = previous.allLinks.slice()
        newAllLinks[commentedLinkIndex] = link
        const result = {
          ...previous,
          allLinks: newAllLinks
        }

        return result
      }
    })

  }

}



// Cannot add params in Link (id:$id , isDeleted : false)
const FIND_LINK_QUERY = gql`
query FindLink($id: ID!){
  Link(id: $id){
    id
    title
    category
    description
    url
    createdAt
    updatedAt
    category
    isDeleted
    votes{
      id
    }
    tags{
      id
      name
    }
    postedBy{
      id
      name
    }
    offers(filter:{isDeleted:false}){
      id
      amount
      offerdescription
      offerBy{
        id
        name
      }
      createdAt
      updatedAt
      comments(filter:{isDeleted:false}){
        id
        content
        author{
          id
          name
        }
        createdAt
        updatedAt
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

}
`

const UPDATE_OFFER_MUTATION = gql`
mutation updateOfferMutation($link:ID! , $newAmount:String! , $newOfferDescription:String!){
updateOffer(
  id:$link
  amount:$newAmount
  offerdescription:$newOfferDescription
)
  {
    id
    amount
    offerdescription
    createdAt
    updatedAt
    offerBy{
      id
      name
      position
    }

  }

}
`


const UPDATE_COMMENT_MUTATION = gql`
mutation updateCommentMutation($link:ID! , $newContent:String!){
updateComment(
  id:$link
  content: $newContent
)
  {
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
`
const DELETE_OFFER_MUTATION = gql`
mutation updateOfferMutation ($id: ID!){
  updateOffer(id:$id , isDeleted:true){
    id
    amount
    isDeleted
    updatedAt
  }
}
`

const DELETE_COMMENT_MUTATION = gql`
mutation updateOfferMutation ($id: ID!){
  updateOffer(id:$id , isDeleted:true){
    id
    content
    updatedAt
  }
}
`

const ALL_LINKS_QUERY = gql`
  query AllLinksQuery{
    allLinks (filter:{isDeleted:false}){
      id
      title
      createdAt
      updatedAt
      url
      description
      isDeleted
      category
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
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
      tags {
        id
        name
        link
        {
          id
        }
      }
    }
    _allLinksMeta {
      count
    }
  }
`



const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export default compose(
  graphql(ALL_LINKS_QUERY, {name: 'allLinksQuery'}),
  graphql(CREATE_VOTE_MUTATION, {name: 'createVoteMutation'}),
  graphql(UPDATE_LINK_MUTATION, {name: 'updateLinkMutation'}),
  graphql(UPDATE_OFFER_MUTATION, {name: 'updateOfferMutation'}),
  graphql(UPDATE_COMMENT_MUTATION, {name: 'updateCommentMutation'}),
  graphql(FIND_LINK_QUERY, {name:'findLinkQuery' , options: (props) =>({variables:{id: props.match.params.id}})})
) (ProductPage)
//https://www.graph.cool/forum/t/filtering-out-data-based-on-whether-relations-exists/215/5
