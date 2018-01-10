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
import Menu, { MenuItem } from 'material-ui-next/Menu';
import SvgIcon from 'material-ui/SvgIcon';
//import FlatButton from 'material-ui/FlatButton';
//import Toggle from 'material-ui/Toggle';

//import NavigationClose from 'material-ui/svg-icons/navigation/close';
//import BalanceIcon from 'material-ui/svg-icons/action/account-balance';

import AppBar from 'material-ui-next/AppBar';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui-next/Typography';
import {withStyles} from 'material-ui/styles';
import AccountCircle from 'material-ui-icons/AccountCircle';
import MenuIcon from 'material-ui-icons/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert'
import Button from 'material-ui-next/Button';
import Toolbar from 'material-ui-next/Toolbar';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};
class Header extends Component {
  state={
    anchorEl: null,
    open: false,
    openLogin: false,
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };
  handleClickLogin = event => {
    this.setState({ openLogin: true, anchorEl: event.currentTarget });
  };
  handleCloseLogin = () => {
    this.setState({ openLogin: false });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };
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



    const anchorEl=this.state;
    const open = Boolean(anchorEl);
    return (
      <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton  styles = {styles.menuButton} color="contrast" aria-label="Menu">
            <MenuIcon
            onClick={this.handleClick}
            />
          </IconButton>
          <Menu
            id="my-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onClose={this.handleClose}
          >
          <MenuItem onClick={this.handleClose} component={Link} to="/" > new </MenuItem>
          <MenuItem onClick={this.handleClose} component={Link} to="/top" > top </MenuItem>
          <MenuItem onClick={this.handleClose} component={Link} to="/search">search</MenuItem>

          {userId &&
          <div>
          <MenuItem onClick={this.handleClose} component={Link} to="/createcategory"> create category </MenuItem>
          <MenuItem onClick={this.handleClose} component={Link} to="/createtag"> create tag </MenuItem>
          <MenuItem onClick={this.handleClose} component={Link} to="/create">submit product</MenuItem>
          </div>
          }
          </Menu>
          <Typography type="title" color="inherit">
            Some Cool App
          </Typography>

          <IconButton  styles = {styles.menuButton} color="contrast" aria-label="Menu">
            <MoreVertIcon
            onClick={this.handleClickLogin}
            />
          </IconButton>
          <Menu
            id="login-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.openLogin}
            onClose={this.handleCloseLogin}
          >
          {userId &&
          <div>
          <MenuItem onClick={this.handleCloseLogin} component={Link} to={"/profile/"+userId}>Profile</MenuItem>
          <MenuItem onClick={this.handleCloseLogin} component={Link} to={"/submissionpage/"+userId}>My Submissions</MenuItem>
          </div>
          }

          {userId ?
            <div onClick={() => {
              localStorage.removeItem(GC_USER_ID)
              localStorage.removeItem(GC_AUTH_TOKEN)
              this.props.history.push(`/new/1`)
            }}>
                <MenuItem onClick={this.handleCloseLogin}>Logout</MenuItem>
            </div>
            :
                <div>
              <MenuItem onClick={this.handleCloseLogin} component={Link} to="/login">Login</MenuItem>
              </div>
          }
          </Menu>

          {userId &&
          <div>
          <Menu
            id="login-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.openMenu}
            onClose={this.state.handleCloseMenu}
          >
          <MenuItem onClick={this.handleClose} component={Link} to="/" > login </MenuItem>
          </Menu>
          </div>
          }
        </Toolbar>
      </AppBar>
    </div>



    )
  }

}

export default withRouter(Header)
