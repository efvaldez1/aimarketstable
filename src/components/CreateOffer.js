import React, { Component } from 'react'
import {graphql,compose} from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID } from '../constants'
import { withRouter } from 'react-router'

//material UI
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
class CreateOffer extends Component {
  constructor(props) {
    super(props);
  }
  handleSelect(event){
    console.log("product chosen")
    this.setState({ link: event.target.value})
    console.log(this.state.link)
  }

  state = {
    amount:'',
    offerdescription:'',
    offerBy:'',
    open: false,

  }
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleChange(evt) {
    const amount = (evt.target.validity.valid) ? evt.target.value : amount;
    console.log(typeof(amount))
    //this.setState({ amount:amount });
  }
  render() {
    const allLinks=this.props.allLinksQuery.allLinks
    console.log("CreateOfferJS")
    console.log(this.props.linkId)

    if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
      console.log(this.props.allLinksQuery.error)
      return <div>Error</div>
    }
    return (

      <div>
        <br/>
        <label><strong> Create Offer</strong></label>
        <div className='flex flex-column mt3'>

        <TextField
          hintText="Enter Amount"
          value={this.state.amount}
          onChange={(e) => this.setState({ amount: e.target.value })}
        />

        <TextField
          hintText="Enter Message"
          value={this.state.offerdescription}
          onChange={(e) => this.setState({ offerdescription: e.target.value })}
        />



        </div>

        <RaisedButton primary={true} label="Submit Offer" onClick={() => this._createOffer()}/>
        <br/>

        <Snackbar
          open={this.state.open}
          message="Submitted your offer!"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }

  _createOffer = async () => {
  const userId = localStorage.getItem(GC_USER_ID)
  console.log(userId)
  const link = this.props.linkId
  const {amount,offerdescription } = this.state

  await this.props.createOfferMutation({
    variables: {
      amount,
      offerdescription,
      link,
      userId
    }
  }

  )
  this.setState({open: true,})
  //do I still need to push() if I make subscription work?
  //this.props.history.push(`/new/1`)
  }

}

export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery($first: Int, $skip: Int, $orderBy: LinkOrderBy) {
    allLinks(first: $first, skip: $skip, orderBy: $orderBy) {
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

const CREATE_OFFER_MUTATION = gql`
mutation CreateOfferMutation($amount:String!,$offerdescription:String!,$link:ID!,$userId:ID!){
  createOffer(
    amount:$amount
    offerdescription:$offerdescription
    linkId:$link
    offerById:$userId

  ){
    id
    amount
    createdAt
    updatedAt
    offerdescription
    link{
      id
      title
    }
    offerBy
    {
      id
    }

  }
}
`
export default compose(
  graphql(ALL_LINKS_QUERY, {name:'allLinksQuery'}),
  graphql(CREATE_OFFER_MUTATION, { name: 'createOfferMutation' })
)(CreateOffer)
//export default graphql(CREATE_OFFER_MUTATION,{name:'createOfferMutation'}) (CreateOffer)
