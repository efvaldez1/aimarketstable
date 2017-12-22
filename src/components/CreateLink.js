import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { GC_USER_ID, LINKS_PER_PAGE } from '../constants'
import { ALL_LINKS_QUERY } from './LinkList'
import CategoryList from './CategoryList'
import Select from 'react-select'
//import Multiselect from './Multiselect'


//Material UI
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

const names = [
'Oliver Hansen',
'Van Henry',
'April Tucker',
'Ralph Hubbard',
'Omar Alexander',
'Carlos Abbott',
'Miriam Wagner',
'Bradley Wilkerson',
'Virginia Andrews',
'Kelly Snyder',
];

class CreateLink extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMultiSelect = this.handleMultiSelect.bind(this);
  }

  handleSelect(event){
    // /alert(this.refs.form.mySelect.value)
    //alert(event.target.value)
    //console.log(this.refs.form.mySelect.value
    console.log(event.target.value)
    this.setState({ category: event.target.value})
  }
  handleMultiSelect = (tag) => {
    //console.log('You\'ve selected:', tag)
    this.setState({tag })
    var temp = tag.slice()
    var tempoptions=[]
    temp.map((item,id)=>
    {tempoptions.push({'id':item.value,'name':item.name})}
    )

    //this.setState({tagsTemp: tempoptions})
    console.log('multi')
    console.log(tag)
    //console.log(tagsTemp)
  }

  state = {
    title: '',
    description: '',
    url: '',
    category:'Publication',        // how to change to first element of API call
    tag:'',
    tagsTemp:''
  }

  handleSelect = (event, index, category) => {

  this.setState({category});
  console.log("event")
  console.log(event.target)
  console.log(this.state.category)
  }
  handleChange = (event, index, values) => this.setState({values});
  menuItems(values) {
    return names.map((name) => (
      <MenuItem
        key={name}
        insetChildren={true}
        checked={values && values.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ));
  }

  render() {
    if (this.props.allTagQuery && this.props.allTagQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.allTagQuery && this.props.allTagQuery.error) {
      console.log(this.props.allTagQuery.error)
      return <div>Error</div>
    }
    const tagToRender = this.props.allTagQuery.allTags
    const options=[]
    const names=[]
    tagToRender.map((tag,id)=>
    {
      options.push(tag.name)
      options.push({'value':tag.id,'label':tag.name})
    }
    )
    const combolist = [{id:1,name:'publication'},{id:2,name:'software'}]
    const {values} = this.state;




    return (
      <div >
        <div className='flex flex-column mt3'>
        <TextField
          hintText="Enter Title"
          value={this.state.title}
          onChange={(e) => this.setState({ title: e.target.value })}
        /><br />

        <TextField
          hintText="Enter Description"
          multiLine={true}
          rows={1}
          rowsMax={15}
          value={this.state.description}
          onChange={(e) => this.setState({ description: e.target.value })}
        /><br />

        <TextField
          hintText="Enter URL"
          value={this.state.url}
          onChange={(e) => this.setState({ url: e.target.value })}
        /><br />
        <label> Category : </label>
        <div onChange={this.handleSelect}>
        <CategoryList  />
        </div>

          <label>Tags :</label>
          <Select
            onChange={this.handleMultiSelect}
            value={this.state.tag}
            multi={true}
        		options={options}
          />


        </div>

        <RaisedButton onClick={() => this._createLink ()} label="Submit" primary={true} style={style} />
      </div>
    )
  }

  _createLink = async () => {
    console.log(this.state.category)
    console.log(this.state.title)

    const temp = this.state.tag.slice()
    const tempoptions=[]
    temp.map((item)=>
    {tempoptions.push(item.value)}
    )
    //this.setState({this.state.tagsTemp:tempoptions})     //must be {value: "" ,label:" "} for Select widget to not cause Error
                                                          //must be {id:ID!} to be accepted by graphcool
    console.log('createLink')
    console.log(tempoptions)
    const postedById = localStorage.getItem(GC_USER_ID)
    if (!postedById) {
      console.error('No user logged in')
      return
    }

    const { title,description, url,category } = this.state
      await this.props.createLinkMutation({
        variables: {
        title,
        description,
        url,
        category,
        postedById,
        tempoptions
      },
      update: (store, { data: { createLink } }) => {
        const first = LINKS_PER_PAGE
        const skip = 0
        const orderBy = 'createdAt_DESC'
        const data = store.readQuery({
          query: ALL_LINKS_QUERY,
          variables: { first, skip, orderBy }
        })
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
    mutation CreateLinkAnConnectTags($title: String! ,$description: String!, $url: String!, $postedById: ID!, $category:String!,$tags:[ID!]) {
        createLink(
            title: $title,
            description: $description,
            url: $url,
            category:$category,
            postedById: $postedById,
            tagsIds: $tags
        ) {
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

//export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink)
//export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink)
export default compose(
  graphql(ALL_TAG_QUERY, {name:'allTagQuery'}),
  graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })
)(CreateLink)


// <div >
//   <div className='flex flex-column mt3'>
//   <input
//     className='mb2'
//     value={this.state.title}
//     onChange={(e) => this.setState({ title: e.target.value })}
//     type='text'
//     placeholder='Title of the Product'
//   />
//
//   <label>{this.state.title}</label>
//   <textarea
//       className='mb2'
//       value={this.state.description}
//       onChange={(e) => this.setState({ description: e.target.value })}
//       placeholder='A description for the product'
//   />
//
//   <input
//       className='mb2'
//       value={this.state.url}
//       onChange={(e) => this.setState({ url: e.target.value })}
//       type='text'
//       placeholder='The URL for the product'
//   />
//
//   <div onChange={this.handleSelect}>
//   Category :
//   <CategoryList  name='mySelect'
//   />
//   </div>
//
//
//     <label>Select as many</label>
//
//     <Select
//
//       onChange={this.handleMultiSelect}
//       value={this.state.tag}
//       multi={true}
//       options={options}
//     />
//
//   </div>
//
//
//
//   <button
//     onClick={() => this._createLink ()}
//   >
//     Submit
//   </button>
//
// </div>
