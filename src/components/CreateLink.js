import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID, LINKS_PER_PAGE } from '../constants'
import { ALL_LINKS_QUERY } from './LinkList'
import CategoryList from './CategoryList'
//import Select from 'react-select'
//import Multiselect from './Multiselect'


//Material UI
import TextField from 'material-ui-next/TextField';
//import Select from 'material-ui/Select';
//import MenuItem from 'material-ui/MenuItem';
//v 1.0
import Select from 'material-ui-next/Select';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui-next/Button';
// import CircularProgress from 'material-ui/CircularProgress';
// v 1.0
import { CircularProgress } from 'material-ui-next/Progress';
import Input, { InputLabel } from 'material-ui-next/Input';
import Snackbar from 'material-ui-next/Snackbar';
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
  handleMultiSelect = (event) => {
    console.log('selected!')
    console.log(event.target.value)
    this.setState({values:event.target.value })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  state = {
    open:false,
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
        <div className='flex flex-column'>
        <TextField
          placeholder="Enter Title"
          value={this.state.title}
          onChange={(e) => this.setState({ title: e.target.value })}
        ></TextField>
        <br/>
        <TextField
          multiline
          placeholder="Enter Description"
          rows={1}
          rowsMax={15}
          value={this.state.description}
          onChange={(e) => this.setState({ description: e.target.value })}
        ></TextField>
        <br/>

        <TextField
          placeholder="Enter URL"
          value={this.state.url}
          onChange={(e) => this.setState({ url: e.target.value })}
        ></TextField>
        <br />

        <CategoryList ref="categorySelector" value={this.state.category} name="myCategoryList" onChange={this.selectCategory.bind(this)}  />


      <InputLabel htmlFor="name-multiple">Choose Tag/s</InputLabel>
      <Select
      multiple
      value={values}
      input={<Input id="name-multiple" />}
      onChange={this.handleMultiSelect}
      >

      {tagToRender.map((tagItem)=>
        (
          <MenuItem

            value={tagItem.id}
          >
            {tagItem.name}
          </MenuItem>
        )
        )
      }
    </Select>
        </div>
        <Button raised onClick={() => this._createLink ()}  color='primary' style={style}>Submit</Button>
        <Snackbar
            open={this.state.open}
            message="No user logged in!"
            autoHideDuration={3000}
            onClose={this.handleRequestClose}
          />
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
      this.setState({open:true})
      return
    }
    console.log(postedById)
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
            isDeleted:false
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


// <br/>
// <Select
// multiple={true}
// hintText="Select Tag/s"
// value={values}
// onChange={this.handleChange}
// >
//
// {tagToRender.map((tagItem)=>
//   (
//     <MenuItem
//       key={tagItem.id}
//       insetChildren={true}
//       checked={values && values.indexOf(tagItem) > -1}
//       value={tagItem.id}
//       primaryText={tagItem.name}
//     />
//   )
//   )
// }
// </Select>
