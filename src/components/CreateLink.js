import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID, LINKS_PER_PAGE } from '../constants'
import { ALL_LINKS_QUERY } from './LinkList'
import CategoryList from './CategoryList'
//import Select from 'react-select'
//import Multiselect from './Multiselect'


//Material UI
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
const style = {
  margin: 12,
};

// learn how to get of index from an array of objects
//https://stackoverflow.com/questions/35823783/finding-the-array-index-of-an-object-with-javascript-react-js
class CreateLink extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);

    this.handleMultiSelect = this.handleMultiSelect.bind(this);
  }

  handleSelect(event){
    console.log(event.target.value)
    this.setState({ category: event.target.value})
  }
  handleMultiSelect = (tag) => {
    this.setState({tag })


  }

  state = {
    title: '',
    description: '',
    url: '',
    category:'Publication',        // how to change to first element of API call
    tag:'',
    tagsTemp:'',
    values:[]
  }

  selectCategory(selectedValue){
    console.log('test')
    this.setState({ category: selectedValue.target.value })

  }
  handleSelect = (event) => {
    this.setState({category:event.target.value})
  }

  handleChange = (event, index, values) => this.setState({values});


  render() {
    if (this.props.allTagQuery && this.props.allTagQuery.loading) {
      return <div><CircularProgress size={90} thickness={7}/></div>
    }

    if (this.props.allTagQuery && this.props.allTagQuery.error) {
      console.log(this.props.allTagQuery.error)
      return <div>Error</div>
    }
    const tagToRender = this.props.allTagQuery.allTags
    const {values} = this.state;
    console.log('values')
    console.log(values)


    return (
      <div >
        <div className='flex flex-column mt3'>
        <TextField
          key="title"
          hintText="Enter Title"
          value={this.state.title}
          onChange={(e) => this.setState({ title: e.target.value })}
        /><br />

        <TextField
          key="description"
          hintText="Enter Description"
          multiLine={true}
          rows={1}
          rowsMax={15}
          value={this.state.description}
          onChange={(e) => this.setState({ description: e.target.value })}
        /><br />

        <TextField
          key="url"
          hintText="Enter URL"
          value={this.state.url}
          onChange={(e) => this.setState({ url: e.target.value })}
        /><br />

        <label> Category : </label>

        <CategoryList ref="categorySelector" name="myCategoryList" onChange={this.selectCategory.bind(this)} />
        <br/>
        <SelectField
        multiple={true}
        hintText="Select Tag/s"
        value={values}
        onChange={this.handleChange}
        >

        {tagToRender.map((tagItem)=>
          (
            <MenuItem
              key={tagItem.id}
              insetChildren={true}
              checked={values && values.indexOf(tagItem) > -1}
              value={tagItem.id}
              primaryText={tagItem.name}
            />
          )
          )
        }
      </SelectField>
        </div>
        <RaisedButton onClick={() => this._createLink ()} label="Submit" primary={true} style={style} />
      </div>
    )
  }

  _createLink = async () => {
    console.log('create link')

    console.log(this.state.title)
    console.log(this.state.description)
    console.log(this.state.url)
    console.log(this.state.category)
    console.log(this.state.values)
    const postedById = localStorage.getItem(GC_USER_ID)
    if (!postedById) {
      console.error('No user logged in')
      return
    }

    const { title,description, url,category,values } = this.state
    console.log(this.state.values)
      await this.props.createLinkMutation({
        variables: {
        title,
        description,
        url,
        category,
        postedById,
        values
      },
      update: (store, { data: { createLink } }) => {
        const first = LINKS_PER_PAGE
        const skip = 0
        const orderBy = 'createdAt_DESC'
        const data = store.readQuery({
          query: ALL_LINKS_QUERY,
          variables: { first, skip, orderBy }
        })
        console.log("data all links")
        console.log(data.alllinks)
        data.allLinks.splice(0,0,createLink)
        data.allLinks.pop()
        store.writeQuery({
          query: ALL_LINKS_QUERY,
          data,
          variables: { first, skip, orderBy }
        })
      }
    })

    this.props.history.push(`/new/1`)
  }

}

//export default graphql(ALL_CATEGORY_QUERY,{name:'allCategoryQuery'}) (CategoryList)
const CREATE_LINK_MUTATION = gql`
    mutation CreateLinkAnConnectTags($title: String! ,$description: String!, $url: String!, $postedById: ID!, $category:String!,$values:[ID!]) {
        createLink(
            title: $title,
            description: $description,
            url: $url,
            category:$category,
            postedById: $postedById,
            tagsIds: $values
        ) {
            id
            title
            createdAt
            updatedAt
            url
            description
            category
            offers{
              id
              amount
            }
            postedBy {
                id
                name
            }
            tags
            {
                  id
                  name
            }
            votes{
              id
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
export default compose(
  graphql(ALL_TAG_QUERY, {name:'allTagQuery'}),
  graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })
)(CreateLink)
