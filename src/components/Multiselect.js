import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Select from 'react-select'
import gql from 'graphql-tag'

class Multiselect extends React.Component {

render(){

  if (this.props.allTagQuery && this.props.allTagQuery.loading) {
    return <div>Loading</div>
  }

  if (this.props.allTagQuery && this.props.allTagQuery.error) {
    console.log(this.props.allTagQuery.error)
    return <div>Error</div>
  }

  //const categoryToRender = [{name:'a'}]
  //alert(this.props.allCategoryQuery.allCategories)

  const tagToRender = this.props.allTagQuery.allTags
  // /const test={categoryToRender.map((category,id)=>({'value':{id},label:category}))}

  //console.log(test)
  const options=[]
  const option={
    value:'',
    label:''
  }

  tagToRender.map((tag,id)=>
    {
      options.push({'value':tag.id,'label':tag.name})
    }
  )

  console.log(options)

  return (
    <div>
  	<label>Multi Tags :</label>
    <Select
      name="form-field-name"

      multi={true}
  		options={options}
    />

  	</div>
  )
}
}

const ALL_TAG_QUERY = gql `
query AllTagQuery{
  #graphql pluralises automatically
  allTags{
    id
    name
    description
		link{       #all relationships must have subselection
      id
    }
  }
}
`

//export default graphql(ALL_TAGS_QUERY,{name:'allTagsQuery'}) (Multiselect)
//const ALL_CATEGORY_QUERY = gql `
//query AllCategoryQuery{
//  #graphql pluralises automatically
//  allCategories{
//    id
//    name
//  }
//}
//`

//export default graphql(ALL_CATEGORY_QUERY,{name:'allCategoryQuery'}) (Multiselect)
export default graphql(ALL_TAG_QUERY,{name:'allTagQuery'}) (Multiselect)
