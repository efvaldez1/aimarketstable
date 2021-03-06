import React, { Component } from 'react'
import Product from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { LINKS_PER_PAGE } from '../constants'


//Material UI
// import CircularProgress from 'material-ui/CircularProgress';
// v 1.0
import { CircularProgress } from 'material-ui-next/Progress';
class LinkList extends Component {

  componentDidMount() {
    this._subscribeToNewLinks()
    this._subscribeToNewVotes()
    this._subscribeToUpdatedLinks()
    this._subscribeToDeletedLinks()
  }

  render() {

    if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div><CircularProgress size={90} thickness={7}/></div>
    }

    if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
      console.log(this.props.allLinksQuery.error)
      return <div>Error</div>
    }

    if(!this.props.allLinksQuery.allLinks){
      return <div> Cannot load products at the moment.</div>
    }
    const isNewPage = this.props.location.pathname.includes('new')
    console.log("links to render")

    const linksToRender = this._getLinksToRender(isNewPage)
    console.log(linksToRender)
    const page = parseInt(this.props.match.params.page, 10)

    return (
      <div>
      <div>
          {linksToRender.map((link, index) => (
            <Product key={link.id} index={page ? (page - 1) * LINKS_PER_PAGE + index : index} updateStoreAfterVote={this._updateCacheAfterVote} link={link}/>
          ))}
        </div>
        {isNewPage &&
        <div className='flex ml4 mv3 gray'>
          <div className='pointer mr2' onClick={() => this._previousPage()}>Previous</div>
          <div className='pointer' onClick={() => this._nextPage()}>Next</div>
        </div>
        }
      </div>
    )
  }

  _getLinksToRender = (isNewPage) => {
    console.log("get links to render")
    if (isNewPage) {
      return this.props.allLinksQuery.allLinks
    }
    const rankedLinks = this.props.allLinksQuery.allLinks.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= this.props.allLinksQuery._allLinksMeta.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? "createdAt_DESC" : null
    const data = store.readQuery({ query: ALL_LINKS_QUERY, variables: { first, skip, orderBy } })
    const votedLink = data.allLinks.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }


  _subscribeToNewLinks = () => {
      console.log("NEW LINK SUBS")
      this.props.allLinksQuery.subscribeToMore({
        document: gql`
          subscription {
            Link(filter: {
              mutation_in: [CREATED]
            }) {
              node {
                id
                title
                url
                description
                category
                createdAt
                updatedAt
                isDeleted
                tags{
                  id
                  name
                }
                postedBy {
                  id
                  name
                  position
                }
                offers{
                  id
                  amount
                  offerdescription
                  offerBy{
                    id
                    name
                    position
                  }
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
              updatedFields
              previousValues{
                title
                description
                url
              }
            }
          }
        `,
        updateQuery: (previous, { subscriptionData }) => {

          const newAllLinks = [
            subscriptionData.data.Link.node,
            ...previous.allLinks
          ]

          const result = {
            ...previous,
            allLinks: newAllLinks
          }


          return result
        }
      })
    }

  _subscribeToUpdatedLinks = () => {
    console.log("UPDATE LINKS SUBS")
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Link(filter: {
            mutation_in: [UPDATED]
          }) {
            node {
              id
              title
              url
              description
              category
              createdAt
              updatedAt
              tags{
                id
                name
              }
              postedBy {
                id
                name
              }
              offers{
                id
                amount
                offerdescription
                offerBy{
                  id
                  name
                  position
                }
              }
              votes {
                id
                user {
                  id
                }
              }
            }
            updatedFields
            previousValues{
              title
              description
              url
              category
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {

        const updatedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Link.node.id)
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

  _subscribeToDeletedLinks = () => {
    console.log("DELETE LINKS SUBS")
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
      subscription {
        Link(filter: {
          mutation_in: [UPDATED]
          updatedFields_contains_some: ["isDeleted"]
        }) {
          node {
            id
            title
            url
            description
            category
            createdAt
            updatedAt
            isDeleted
            tags{
              id
              name
            }
            postedBy {
              id
              name
            }
            offers{
              id
              amount
              offerdescription
              offerBy{
                id
                name
                position
              }
            }
            votes {
              id
              user {
                id
              }
            }
          }
          updatedFields
          previousValues{
            title
            description
            url
            category
          }
        }
      }
      `,
      updateQuery: (previous, { subscriptionData }) => {

        const updatedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Link.node.id)
        const link = subscriptionData.data.Link.node
        const newAllLinks = previous.allLinks.slice()
        console.log("after del")
        //newAllLinks[updatedLinkIndex] = link
        newAllLinks.splice(updatedLinkIndex,1)
        console.log(link)
        console.log(newAllLinks)
        const result = {
          ...previous,
          allLinks: newAllLinks
        }

        return result
      }
    })
  }

  _subscribeToNewVotes = () => {
    console.log("VOTE SUBS")
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Vote(filter: {

              mutation_in: [CREATED, UPDATED, DELETED]
          }) {
            node {
              id
              link {
                id
                url
                description
                createdAt
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
              }
              user {
                id
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        console.log("update votes")
        const votedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.Vote.node.link.id)
        const link = subscriptionData.Vote.node.link
        const newAllLinks = previous.allLinks.slice()
        newAllLinks[votedLinkIndex] = link
        const result = {
          ...previous,
          allLinks: newAllLinks
        }

        return result
      }
    })
  }

}

export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery($first: Int, $skip: Int, $orderBy: LinkOrderBy) {
    allLinks(first: $first, skip: $skip, orderBy: $orderBy , filter:{isDeleted:false}) {
      id
      title
      isDeleted
      updatedAt
      createdAt
      url
      description
      category
      postedBy {
        id
        name
        position
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
          position
        }
      }
      tags{
        id
        name
      }


    }
    _allLinksMeta {
      count
    }
  }
`

export default graphql(ALL_LINKS_QUERY, {
  name: 'allLinksQuery',
  options: (ownProps) => {
    const page = parseInt(ownProps.match.params.page, 10)
    const isNewPage = ownProps.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return {
      variables: { first, skip, orderBy }
    }
  }
})(LinkList)
