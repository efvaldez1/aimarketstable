import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


//Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class CategoryList extends Component {


  handleChange = (event, index, category) => {

  this.setState({category:category.name});
  console.log("event")
  console.log(event.target)
  console.log(this.state.category)
  }
  render(){

    if (this.props.allCategoryQuery && this.props.allCategoryQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.allCategoryQuery && this.props.allCategoryQuery.error) {
      return <div>Error</div>
      {categoryToRender.map((category)=>
      (console.log(category.id)))
      }
    }

    const categoryToRender = this.props.allCategoryQuery.allCategories
    console.log(categoryToRender)
    return (
      <div>
      <select name={this.props.name}>
      {categoryToRender.map((category)=>
      (<option key={category.id} value={category.name}>
      {category.name}
      </option>))
      }
      </select>
      </div>
    )
  }
}

const ALL_CATEGORY_QUERY = gql `
query AllCategoryQuery{
  #graphql pluralises automatically
  allCategories{
    id
    name
  }
}
`

export default graphql(ALL_CATEGORY_QUERY,{name:'allCategoryQuery'}) (CategoryList)




//<SelectField name={this.props.name}
//floatingLabelText="Choose Category"
//>
//{categoryToRender.map((category)=>
//(<MenuItem id={category.id} value={category.name} primaryText={category.name} />))
//}
//</SelectField>
