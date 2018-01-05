import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


//Material UI
//import SelectField from 'material-ui/SelectField';
//import MenuItem from 'material-ui/MenuItem';
import Input, { InputLabel } from 'material-ui-next/Input';
import { MenuItem } from 'material-ui-next/Menu';
import Select from 'material-ui-next/Select';

class CategoryList extends Component {
  handleChange = (event, index, category) => {
  this.setState({category:category.name});

  }
  render(){

    if (this.props.allCategoryQuery && this.props.allCategoryQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.allCategoryQuery && this.props.allCategoryQuery.error) {
      return <div>Error</div>

    }

    const categoryToRender = this.props.allCategoryQuery.allCategories
    console.log('val')
    console.log(this.props)
    return (
      <div>



    <InputLabel htmlFor="category">Choose Category: </InputLabel>
          <Select
            fullWidth
            name="category"
            value={this.props.value}
            onChange={this.props.onChange}
            input={<Input name="category" id="category" />}
          >
          {categoryToRender.map((category)=>
              (

                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              )
            )
          }
    </Select>


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


    //
    //
    // <SelectField name={this.props.name}
    // floatingLabelText="Choose Category"
    // onChange={this.props.onChange}
    // >
    // {categoryToRender.map((category,id)=>
    // (<MenuItem key={category.id} label={category.name} value={category.id}  primaryText={category.name}></MenuItem>))
    // }
    // </SelectField>
