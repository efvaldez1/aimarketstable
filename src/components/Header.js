import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'


// Material UI
//import {Tabs, Tab} from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
// import Menu from 'material-ui/Menu';
//import MenuItem from 'material-ui/MenuItem';
//import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
//import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
// v1.0
import Menu, { MenuItem } from 'material-ui/Menu';
import SvgIcon from 'material-ui/SvgIcon';
//import FlatButton from 'material-ui/FlatButton';
//import Toggle from 'material-ui/Toggle';

//import NavigationClose from 'material-ui/svg-icons/navigation/close';
//import BalanceIcon from 'material-ui/svg-icons/action/account-balance';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui-next/Typography';
import {withStyles} from 'material-ui/styles';  
import AccountCircle from 'material-ui-icons/AccountCircle';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui-next/Button';
class Header extends Component {
  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    const PageMenu = (
        <Menu
          iconButtonElement={
            <IconButton >
              <MenuIcon/>
              </IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          {<Link to='/'><MenuItem > new </MenuItem></Link>}
          {<Link to='/top'><MenuItem > top </MenuItem></Link>}
          {<Link to='/search'><MenuItem> search </MenuItem></Link>}

          {userId &&
          <div>
          <Link to='/createcategory'><MenuItem> create category </MenuItem></Link>
          <Link to='/createtag'><MenuItem> create tag </MenuItem></Link>
          <Link to='/create'><MenuItem >submit product</MenuItem></Link>
          </div>
          }
        </Menu>
      );

      const LogoutMenu = (
        <Menu

          iconButtonElement={
            <IconButton></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
        {userId &&
        <div>
        {<Link to={'/profile/'+userId} ><MenuItem primaryText="Profile"></MenuItem></Link>}
        {<Link to={'/submissionpage/'+userId} ><MenuItem primaryText="My Submissions"></MenuItem></Link>}
        </div>
        }

        {userId ?
          <div onClick={() => {
            localStorage.removeItem(GC_USER_ID)
            localStorage.removeItem(GC_AUTH_TOKEN)
            this.props.history.push(`/new/1`)
          }}>
              <MenuItem primaryText="Logout" />
          </div>
          :
              <div>
            {<Link to='/login' ><MenuItem primaryText="Login"></MenuItem></Link>}
            </div>
        }

        </Menu>
      );

      const styles = {
        title: {
          cursor: 'pointer',
        },
      };

    return (
      <div >
      <AppBar position="static">
        <Toolbar>
          <IconButton  color="contrast" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography type="title" color="inherit">
            Title
          </Typography>
          <Button color="contrast">Login</Button>
        </Toolbar>
      </AppBar>
    </div>



    )
  }

}

export default withRouter(Header)
