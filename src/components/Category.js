import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Category extends Component {

  render() {
    const=
    return (
      <div>
        {this.props.category}
      </div>
    )
  }
}
