import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql,compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
// Material UI
import Card, {CardContent, CardActions, CardHeader} from 'material-ui-next/Card'
import { CircularProgress } from 'material-ui-next/Progress';
import Button from 'material-ui-next/Button';
import TextField from 'material-ui-next/TextField';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui-next/Tabs';


class DeleteProduct extends Component{
  render() {
    state = {
      newTitle:'',
      newDescription:'',
      newURL: '',
      newCategory: '',
      open: false,
    }

    return
    (
      <Dialog
        placeholder="Edit Submision"
        actions={
          <Button
            color='primary'
            onClick={this.props.handleClose}
          >Cancel</Button>,
          <Button
            color='primary'
            onClick={() => this.props.onClick}
          >Submit</Button>
        }
        open={this.state.open}
        autoScrollBodyContent={true}
      >
      <div>

      <TextField
        placeholder="Title"
        defaultValue={this.props.link.title}
        fullWidth
        onChange={(e) => this.setState({ newTitle: e.target.value })}
      />

      <TextField
        placeholder="Description"
        defaultValue={this.props.link.description}
        multiline
        rows={2}
        onChange={(e) => this.setState({ newDescription: e.target.value })}
      />

      <TextField
        placeholder="URL"
        fullWidth
        defaultValue={this.props.link.url}
        onChange={(e) => this.setState({ newURL: e.target.value })}
      />

      <TextField
        placeholder="Category"
        fullWidth
        defaultValue={this.props.link.category}
        onChange={(e) => this.setState({ newCategory: e.target.value })}
      />

      </div>

      </Dialog>

    )
  }


}

export
