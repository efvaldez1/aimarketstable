import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql,compose } from 'react-apollo'
import gql from 'graphql-tag'
import CreateComment from './CreateComment'
import CreateOffer from './CreateOffer'



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
import CircularProgress from 'material-ui/CircularProgress';
import Img from 'react-image'
//React-PDF
import { Document, Page } from 'react-pdf';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class ProductPage extends Component {
  componentDidMount() {
    this._subscribeToNewOffers()
    this._subscribeToNewComments()
    this._subscribeToUpdatedLinks()

  }
  state = {
    link:{},
    newTitle:'',
    newDescription:'',
    newURL:'',
    newCategory:'',
    newAuthor:'',
    open: false,
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };


  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={() => this._updateLink()}
      />,
    ]

    if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div><CircularProgress size={90} thickness={7}/></div>
    }

    if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
      console.log(this.props.allLinksQuery.error)
      return <div>Error</div>
    }
    const id = this.props.match.params.id
    console.log(id)
    const result = this.props.allLinksQuery.allLinks
    console.log(result)
    var link ={}
    const len = result.length;
    for (var i = 0; i < len; i++) {
      if(result[i].id===id)
      {
        link=result[i]
      }
    }
    console.log("found")
    console.log(link)
    this.link=link
    console.log("this")
    console.log(this.link)
  //  const product = this.props.findLinkQuery.findLink({
  //    variables: {
  //    Id
  //  }
  //})
    //console.log(product)
    let  EditButton=null
    if(link.postedBy.id===userId) {
        EditButton = <RaisedButton primary={true} label="Edit Submission" onClick={this.handleOpen} />
    }
    return (
      <div>
      <Card>
        <CardHeader
          title={link.postedBy.name ?link.postedBy.name : 'Unknown'}
          subtitle="Position Or Company"
          avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
        />
        <CardMedia
          overlay={<CardTitle title={link.title} subtitle={"By " + link.postedBy.name} />}
        >
          <img src="http://americanconstruction.net/wp-content/uploads/2015/10/upload-empty.png" alt="" />
        </CardMedia>

        <CardTitle title={link.title} />
        <CardText>
          <div>{link.description}</div>
          <br/>
          <div> <strong> URL: </strong> {link.url}</div>
          <div> <strong> Category: </strong> {link.category || 'None'}</div>
          <div> <strong> Submitted On: </strong> {link.createdAt} ({timeDifferenceForDate(link.createdAt)}) </div>
          <div> <strong> Last updated at: </strong> {link.updatedAt} ({timeDifferenceForDate(link.updatedAt)}) </div>
          <div> <strong> Tags: </strong>
              {link.tags.length!==0 ? link.tags.map((tagItem)=>
              (<a>{tagItem.name} </a>)
            ) : 'None'
              }
          </div>
          <div> <strong> No. Of Offers: </strong> {link.offers.length||"N/A"} </div>
          <div className='f6 lh-copy gray'>{link.votes.length} votes </div>
          <div>
          {EditButton}

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
        </CardText>
        <CardActions>
          <label> <strong> Share Via: </strong> </label>
          <FlatButton label="LinkedIn" />
          <FlatButton label="Facebook" />
          <FlatButton label="Twitter" />
          <br/>
          <label>  <strong> Other Links: </strong> </label>
          <FlatButton label="Github" />

        </CardActions>
      </Card>
            <div>
            <br/>
            <label><strong>Offers :</strong></label>
            <br/>
            <div>
              {userId &&
                <div>
                <CreateOffer linkId={link.id}/>
                <br/>
                </div>
              }
              <div>
              {link.offers.map((offerItem)=>(
                <div>
                <Card key={offerItem.id}>
                  <CardHeader

                    title={offerItem.offerBy.name}
                    subtitle="User's Position"
                    avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
                  />
                  <CardText>
                      <div>

                      <a>Amount: {offerItem.amount}</a><br/>
                      <a>Description: {offerItem.offerdescription}</a><br/>

                      <div className='f6 lh-copy gray'>
                        <a><strong> Created: </strong>{timeDifferenceForDate(offerItem.createdAt)} </a><br/>
                      </div>

                      <label><strong>Comments : </strong></label>
                      {offerItem.comments.map((commentItem)=>
                        (
                          <Card key={commentItem.id}>
                            <CardHeader
                              title={commentItem.author.name}
                              subtitle="User's Position"
                              avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
                            />
                            <CardText>
                                <div>
                                <a>{commentItem.content}</a>
                                <br/>
                                <div className='f6 lh-copy gray'>
                                  <a> Created: {timeDifferenceForDate(commentItem.createdAt)}</a><br/>
                                </div>

                                <br/>
                                </div>
                            </CardText>

                          </Card>
                        )
                      )
                      }
                      </div>
                  </CardText>
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

  _updateLink = async() => {
    console.log('heyy');
    console.log(this.link)
    var linkId = this.link.id
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
        console.log("update offers")
        console.log(subscriptionData.data.Offer.node)
        const offeredLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Offer.node.link.id)
        const link = subscriptionData.data.Offer.node.link
        console.log('link1')
        console.log(link)
        const newAllLinks = previous.allLinks.slice()
        newAllLinks[offeredLinkIndex] = link
        const result = {
          ...previous,
          allLinks: newAllLinks
        }
        console.log("offer subscription")
        console.log(result)
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
        console.log("update comments")
        console.log(subscriptionData.data.Comment.node)
        console.log(subscriptionData.data.Comment.node.offer)
        console.log(subscriptionData.data.Comment.node.offer.link)
        const commentedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Comment.node.offer.link.id)
        const link = subscriptionData.data.Comment.node.offer.link
        console.log("linkx")
        console.log(link)
        const newAllLinks = previous.allLinks.slice()
        newAllLinks[commentedLinkIndex] = link
        const result = {
          ...previous,
          allLinks: newAllLinks
        }
        console.log("comment subscription")
        console.log(result)
        return result
      }
    })

  }

}
console.log(this.props)
//const Id = this.props.match.params.id
//const FIND_LINK_QUERY = gql`
//query findLink($id: ID!){
//  Link(id: $id){
//    title
//    category
//    description
//  }
//}
//`

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
const ALL_LINKS_QUERY = gql`
  query AllLinksQuery{
    allLinks {
      id
      title
      createdAt
      updatedAt
      url
      description
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
  graphql(UPDATE_LINK_MUTATION, {name: 'updateLinkMutation'})
  //graphql(FIND_LINK_QUERY, {name: 'findLinkQuery'})
) (ProductPage)
