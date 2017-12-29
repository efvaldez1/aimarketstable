import React, { Component } from 'react'
import { graphql,compose,withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'
import Select from 'react-select'
import Multiselect from './Multiselect'
import CategoryList from './CategoryList'

// Material UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const names = [
  {name:'Oliver Hansen',value:1},
  {name:'Van Henry', value:2},
  {name:'April Tucker',value:3}
];

class Search extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMultiSelect = this.handleMultiSelect.bind(this);
  }

  state = {
    links: [],
    searchText: '',
    categoryText:'',
    tags:[]
  }

  handleChange = (event, index, tags) => {
      this.setState({tags});
      console.log("handle change")
      console.log(index)
      console.log(event)
      console.log(tags)
  }

  menuItems(tags) {
    return names.map((nameItem) => (
      <MenuItem
        key={nameItem.value}
        insetChildren={true}
        checked={tags && tags.indexOf(nameItem) > -1}
        value={nameItem.value}
        primaryText={nameItem.name}
      />
    ));
  }


  handleSelect(event){
    console.log("selected " + event.target.value )
    this.setState({ categoryText: event.target.value})
  }

  handleMultiSelect = (tags) => {
    this.setState({tags })
    console.log('multi')
    console.log(tags)
  }

  render() {
    if (this.props.allTagQuery && this.props.allTagQuery.loading) {
      return <div><CircularProgress size={90} thickness={7}/></div>
    }

    if (this.props.allTagQuery && this.props.allTagQuery.error) {
      console.log(this.props.allTagQuery.error)
      return <div>Error</div>
    }
    const tagToRender = this.props.allTagQuery.allTags
    const {tags} = this.state
    console.log('t')
    console.log(tags)
    const options=[]
    tagToRender.map((tag,id)=>
    {
      options.push({'value':tag.id,'label':tag.name})
    }
    )
    return (

      <div>
        <div>
        <div className='flex flex-column mt3'>
          <TextField
            hintText="Search Title Or Description"
            value = {this.state.searchText}
            onChange={(e) => this.setState({ searchText: e.target.value })}
          /><br/>


        </div>



          <div onChange={this.handleSelect}>
            <div> <label>Category :</label></div><CategoryList  name='mySelect' />
          </div>
          <br/>

          <SelectField
            multiple={true}
            hintText="Select a name"
            value={tags }
            onChange={this.handleChange}
          >
            {this.menuItems(tags)}
          </SelectField>

          <br/>
          <RaisedButton primary={true} label="Search" onClick={() => this._executeSearch()} />

        </div>
        {this.state.links.map((link, index) => <Link key={link.id} link={link} index={index}/>)}
      </div>
    )
  }

  _executeSearch = async () => {
    const tagIds=[]
    this.state.tag.map((item)=>
    {tagIds.push(item.value)
      console.log(item)
    }
    )

    console.log('tag options')
    console.log(tagIds)

    const { searchText, categoryText } = this.state
    console.log(searchText)
    console.log(categoryText)
    const result = await this.props.client.query({
      query: ALL_LINKS_SEARCH_QUERY,
      variables: { searchText ,categoryText}
    })
    const links = result.data.allLinks
    console.log('links')
    console.log(links)
    this.setState({ links })
  }
}

const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText:String!, $categoryText:String!) {
    allLinks(filter: {
      OR:
      [
            {category:$categoryText},
            {
              OR: [{
                  title_contains: $searchText
                }, {
                  description_contains: $searchText
                }]
            }
      ]

    }) {
      id
      title
      url
      description
      category
      createdAt
      postedBy {
        id
        name
      }
      tags{
        id
        name
      }
      offers{
        id
        amount
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`
const ALL_TAG_QUERY = gql `
query AllTagQuery{
  #graphql pluralises automatically
  allTags{
    id
    name

		link{       #all relationships must have subselection
      id
    }
  }
}
`
//export default withApollo(Search)
export default compose(
  graphql(ALL_TAG_QUERY, {name:'allTagQuery'}),
  withApollo
)(Search)
// /https://stackoverflow.com/questions/41515226/graphql-filter-data-in-an-array


//          (Tags can only search using 1 tag not list of tags)
//          <Select
//            placeholder="Tags"
//            onChange={this.handleMultiSelect}
//            value={this.state.tag}
//            multi={true}
//        		options={options}
//          />
