import React, { Component } from 'react'
import LinkList from './LinkList'
import CreateLink from './CreateLink'
import Header from './Header'
import Login from './Login'
import Search from './Search'
import CreateCategory from './CreateCategory'
import CategoryList from './CategoryList'
import CreateTag from './CreateTag'
import Profile from './Profile'
import ProductPage from './ProductPage'
import { Switch, Route, Redirect } from 'react-router-dom'
import 'react-select/dist/react-select.css';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <div className='center w85'>
        <Header />
        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/' render={() => <Redirect to='/new/1' />} />
            <Route exact path='/create' component={CreateLink}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/search' component={Search}/>
            <Route exact path='/top' component={LinkList}/>
            <Route exact path='/createtag' component={CreateTag} />
            <Route exact path='/product/:id' component={ProductPage}/>
            <Route exact path='/createcategory' component={CreateCategory} />
            <Route exact path='/categorylist' component={CategoryList} />
            <Route exact path='/new/:page' component={LinkList} />
            <Route exact path='/profile/:id' component={Profile} />
          </Switch>
        </div>
      </div>
      </MuiThemeProvider>
    )
  }

}

export default App
