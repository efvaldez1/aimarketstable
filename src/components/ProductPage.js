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
import Img from 'react-image'
//React-PDF
import { Document, Page } from 'react-pdf';

class ProductPage extends Component {
  componentDidMount() {
    this._subscribeToNewOffers()
    this._subscribeToNewComments()

  }
  render() {
    if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div>Loading</div>
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
  //  const product = this.props.findLinkQuery.findLink({
  //    variables: {
  //    Id
  //  }
  //})
    //console.log(product)
    return (
      <div>
      <Card>
        <CardHeader
          title={link.postedBy.name}
          subtitle="Position Or Company"
          avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
        />
        <CardMedia
          overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
        >
          <img src="http://americanconstruction.net/wp-content/uploads/2015/10/upload-empty.png" alt="" />
        </CardMedia>

        <CardTitle title={link.title} />
        <CardText>
          <div>{link.description}</div>
          <br/>
          <div> <strong> URL: </strong> {link.url}</div>
          <div> <strong> Category: </strong> {link.category}</div>
          <div> <strong> Tags: </strong>
              {link.tags.map((tagItem)=>
              (<a>{tagItem.name} </a>)
              )
              }
          </div>
          <div> <strong> No. Of Offers: </strong> {link.offers.length||"N/A"} </div>
          <div className='f6 lh-copy gray'>{link.votes.length} votes | by {link.postedBy ?link.postedBy.name : 'Unknown'} {timeDifferenceForDate(link.createdAt)}</div>
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
            <div className='flex mt2 items-start'>
            <div className='ml1'>
              <div> <strong>ID:</strong> {link.id} </div>
              <div> <strong>Title:</strong> {link.title} </div>

              <div><strong> Description:</strong> {link.description} </div>
              <div> <strong> URL: </strong> <a href={link.url}>{link.url}</a></div>
              <div> <strong> Category: </strong> {link.category}  </div>
              <div> <strong> Tags: </strong>
                  {link.tags.map((tagItem)=>
                  (<a>{tagItem.name} </a>)
                  )
                  }
              </div>

              <CreateOffer linkId={link.id}/>
              <br/>
              <div>
              {link.offers.map((offerItem)=>(
                <Card>
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
                        <a>Created At: {timeDifferenceForDate(offerItem.createdAt)}</a><br/>
                      </div>

                      <label><strong>Comments : </strong></label>
                      {offerItem.comments.map((commentItem)=>
                        (
                          <Card>
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
                                  <a>Created At: {timeDifferenceForDate(commentItem.createdAt)}</a><br/>
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
                  <CreateComment offerId={offerItem.id} productId={link.id}/>
                  </CardActions>
                </Card>
              )
              )
              }

              </div>

            </div>
            </div>
      </div>


    )
  }

  _subscribeToNewOffers= () => {
      //implement this
  }

  _subscribeToNewComments = () => {
    // implement this

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
const ALL_LINKS_QUERY = gql`
  query AllLinksQuery{
    allLinks {
      id
      title
      createdAt
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
  //graphql(FIND_LINK_QUERY, {name: 'findLinkQuery'})
) (ProductPage)
