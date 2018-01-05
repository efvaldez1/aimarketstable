import React, { Component } from 'react'
import {graphql,compose} from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID } from '../constants'
// /import { withRouter } from 'react-router'

//material UI
import Snackbar from 'material-ui/Snackbar';
//import Button from 'material-ui/Button';
// v 1.0
import Button from 'material-ui-next/Button';
import TextField from 'material-ui-next/TextField';
class CreateOffer extends Component {

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

  //handleChange(evt) {
  //  const amount = (evt.target.validity.valid) ? evt.target.value : amount;
  //  console.log(typeof(amount))
  //  this.setState({ amount:amount });
  //}
  render() {
    console.log("CreateOfferJS")

    return (

      <div>
        <br/>
        <label><strong> Create Offer</strong></label>
        <div className='flex flex-column mt3'>

        <TextField
          placeholder="Enter Amount"
          value={this.state.amount}
          onChange={(e) => this.setState({ amount: e.target.value })}
        />

        <TextField
          placeholder="Enter Message"
          value={this.state.offerdescription}
          fullWidth={true}
          onChange={(e) => this.setState({ offerdescription: e.target.value })}
        />
        </div>

        <Button raised color='primary' onClick={() => this._createOffer()}>Submit Offer</Button>
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


const CREATE_OFFER_MUTATION = gql`
mutation CreateOfferMutation($amount:String!,$offerdescription:String!,$link:ID!,$userId:ID!){
  createOffer(
    amount:$amount
    offerdescription:$offerdescription
    linkId:$link
    offerById:$userId
    isDeleted:false
  ){
    id
    amount
    createdAt
    updatedAt
    isDeleted
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

  graphql(CREATE_OFFER_MUTATION, { name: 'createOfferMutation' })
)(CreateOffer)
//export default graphql(CREATE_OFFER_MUTATION,{name:'createOfferMutation'}) (CreateOffer)
