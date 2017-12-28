import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'


// Material UI
//import {Tabs, Tab} from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import BalanceIcon from 'material-ui/svg-icons/action/account-balance';

import AppBar from 'material-ui/AppBar';
class Header extends Component {
  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    const PageMenu = (
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
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
        </IconMenu>
      );

      const LogoutMenu = (
        <IconMenu

          iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
        {userId &&
        <div>
        {<Link to={'/profile/'+userId} ><MenuItem primaryText="Profile"></MenuItem></Link>}
        {<MenuItem primaryText="Settings (NOT YET IMPLEMENTED)" ></MenuItem>}
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

        </IconMenu>
      );

      const styles = {
        title: {
          cursor: 'pointer',
        },
      };

    return (
      <div>
        <AppBar title={<span style={styles.title}>AI Market</span>} iconElementLeft={PageMenu}  iconElementRight={LogoutMenu} />

      </div>


    )
  }

}

export default withRouter(Header)
