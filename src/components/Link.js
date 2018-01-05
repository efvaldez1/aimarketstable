import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
//material ui
//import {Card, CardActions, CardHeader, CardContent} from 'material-ui/Card'
import Card, { CardHeader,CardActions, CardContent } from 'material-ui-next/Card';
import Avatar from 'material-ui/Avatar';

// import Button from 'material-ui/Button';
//v 1.0
import Button from 'material-ui-next/Button';
//import IconButton from 'material-ui/IconButton';
//import Img from 'react-image'
import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
import ThumbUp from 'material-ui-icons/ThumbUp';
import Search from 'material-ui-icons/Search';
import PropTypes from 'prop-types';
import {withStyles } from 'material-ui/styles';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui-next/Typography';
const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}

const styles2 = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});


class Product extends Component {
  constructor(props) {
  super(props);
  this.state = {
    open: false,
  };
}

handleClick = () => {
  this.setState({
    open: true,
  });
};

handleRequestClose = () => {
  this.setState({
    open: false,
  });
};
  render() {
    const userId = localStorage.getItem(GC_USER_ID)


    return (
      <div>
      <Card>
      <CardHeader
        title={<Link to={'/profile/'+this.props.link.postedBy.id} > {this.props.link.postedBy.name ? this.props.link.postedBy.name : 'Unknown'}</Link>}
        action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
        subheader={this.props.link.postedBy.position ? this.props.link.postedBy.position : "No job description yet"}
        avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
      >
      </CardHeader>
      <CardContent>

      <div><strong>Title: </strong> {this.props.link.title} </div>
      <div><strong> Description:</strong> {this.props.link.description} </div>
      <div> <strong> URL: </strong> <a href={this.props.link.url}>{this.props.link.url}</a></div>
      <div> <strong> Category: </strong> {this.props.link.category}  </div>
      <div> <strong> No. of Tags: </strong> {this.props.link.tags.length||"None"}  </div>
      <div style={styles.wrapper}>

        {this.props.link.tags.map((tagItem)=>
            (
              <Chip key = {tagItem.id}
                style={styles.chip}
              >
                {tagItem.name}
              </Chip>

            )
          )
        }
      </div>

      <div><strong> Submited On:</strong> {this.props.link.createdAt} ({timeDifferenceForDate(this.props.link.createdAt)})</div>
      <div><strong> Last Updated:</strong> ({timeDifferenceForDate(this.props.link.updatedAt)})</div>
      <br/>

      <br/>
      <div className='f6 lh-copy gray'>  {this.props.link.votes.length} votes </div>
      </CardContent>
        <CardActions>
        <div className='flex items-center'>
             {userId &&
               <div>
                <Button style={styles2.button} onClick={() => this._voteForLink()}>
                  Vote
                  <ThumbUp style={styles2.rightIcon}/>
                </Button>
                </div>
              }
              <div>
               <Button component={Link} to={'/product/'+this.props.link.id} style={styles2.button} onClick={() => this._voteForLink()}>
                  Learn More
                 <Search style={styles2.rightIcon}/>
               </Button>
               </div>
        </div>
        </CardActions>
      </Card>

      <Snackbar
          open={this.state.open}
          message="You have voted for this!"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }

  _voteForLink = async () => {
    const userId = localStorage.getItem(GC_USER_ID)
    this.setState({open: true,})
    const voterIds = this.props.link.votes.map(vote => vote.user.id)
    if (voterIds.includes(userId)) {

      console.log(`User (${userId}) already voted for this link.`)
      return
    }

    const linkId = this.props.link.id
    await this.props.createVoteMutation({
      variables: {
        userId,
        linkId
      },
      update: (store, { data: { createVote } }) => {
        this.props.updateStoreAfterVote(store, createVote, linkId)
      }
    })
  }

}

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

// Product.propTypes = {
//   classes: PropTypes.object.isRequired,
// };
export default graphql(CREATE_VOTE_MUTATION, {
  name: 'createVoteMutation'
})(Product)

// const actions = [
//   <Button
//     label="Cancel"
//     primary={false}
//     onClick={this.handleClose}
//   />,
//   <Button
//     label="Submit"
//     primary={true}
//     onClick={() => this._updateLink()}
//   />,
// ]
