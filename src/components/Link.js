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
import Chip from 'material-ui-next/Chip';
import ThumbUp from 'material-ui-icons/ThumbUp';
import Search from 'material-ui-icons/Search';
import PropTypes from 'prop-types';
import {withStyles } from 'material-ui/styles';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui-next/Typography';
import FaGithub from 'react-icons/lib/fa/github'
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


class Product extends Component {
  constructor(props) {
  super(props);
  this.state = {
    open: false,
    openVotedAgain:false,
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
handleRequestCloseVotedAgain = () => {
  this.setState({
    openVotedAgain: false,
  });
};
  render() {
    const userId = localStorage.getItem(GC_USER_ID)


    return (
      <div>
      <Card>
      <CardHeader
        title={<Link to={'/profile/'+this.props.link.postedBy.id} > {this.props.link.postedBy.name ? this.props.link.postedBy.name : 'Unknown'}</Link>}
        subheader={this.props.link.postedBy.position ? this.props.link.postedBy.position : "No job description yet"}
        avatar={<Avatar src="http://www.gotknowhow.com/media/avatars/images/default/large-user-avatar.png" />}
      >
      </CardHeader>
      <CardContent>

      <div style={styles.header}>!!! {this.props.link.title} </div>
      <div style={styles.paragraph}> {this.props.link.description} </div>
      <div> <strong> URL: </strong> <a href={this.props.link.url}>{this.props.link.url}</a></div>
      <div> <strong> Category: </strong> {this.props.link.category}  </div>
      <div style={styles.wrapper}> <strong>  Tags: </strong>



        {this.props.link.tags.length!==0 ? this.props.link.tags.map((tagItem)=>
        (<Chip label={tagItem.name} style={styles.chip}> </Chip>)
        ) : 'None'
        }

      </div>

      <div><strong> Submited On:</strong> {this.props.link.createdAt.slice(0,10)} ({timeDifferenceForDate(this.props.link.createdAt)})</div>
      <div><strong> Last Updated:</strong> ({timeDifferenceForDate(this.props.link.updatedAt)})</div>
      <br/>

      <br/>
      <div className='f6 lh-copy gray'>  {this.props.link.votes.length} votes </div>
      </CardContent>
        <CardActions>
        <div className='flex items-center'>
             {userId &&
               <div>
                <Button raised style={styles.button} onClick={() => this._voteForLink()}>
                  Vote
                  <ThumbUp style={styles2.rightIcon}/>
                </Button>
                </div>
              }
              <div>
               <Button raised component={Link} to={'/product/'+this.props.link.id} style={styles.button} onClick={() => this._voteForLink()}>
                  Learn More
                 <Search style={styles2.rightIcon}/>
               </Button>
               </div>
        </div>
        </CardActions>
      </Card>
      <Snackbar
          open={this.state.openVotedAgain}
          message="Sorry, but you have already voted for this."
          autoHideDuration={3000}
          onRequestClose={this.handleRequestCloseVotedAgain}
        />

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

    const voterIds = this.props.link.votes.map(vote => vote.user.id)
    if (voterIds.includes(userId)) {
      this.setState({openVotedAgain:true,})
      console.log(`User (${userId}) already voted for this link.`)
      return
    }

    this.setState({open: true,})
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



        //
        // {this.props.link.tags.map((tagItem)=>
        //     (
        //       <Chip key = {tagItem.id}
        //         style={styles.chip}
        //       >
        //         {tagItem.name}
        //       </Chip>
        //
        //     )
        //   )
        // }
