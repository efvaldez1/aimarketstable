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
        {<Link to='/profile' ><MenuItem primaryText="Profile"></MenuItem></Link>}
        {<MenuItem primaryText="Settings/Edit Profile" ></MenuItem>}
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
            <MenuItem primaryText={<Link to='/login' >Login</Link>} />
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

          <div className='flex pa1 justify-between nowrap orange'>
            <div className='flex flex-fixed black'>
              <div className='fw7 mr1'>AI Market</div>
              <Link to='/' className='ml1 no-underline black'>new</Link>
              <div className='ml1'>|</div>
              <Link to='/top' className='ml1 no-underline black'>top</Link>
              <div className='ml1'>|</div>
              <Link to='/search' className='ml1 no-underline black'>search</Link>
              <div className='ml1'>|</div>
              <Link to='/createtag' className='ml1 no-underline black'>create tag</Link>
              <div className='ml1'>|</div>
              <Link to='/createcategory' className='ml1 no-underline black'>create category</Link>

              {userId &&
              <div className='flex'>
                <div className='ml1'>|</div>
                <Link to='/create' className='ml1 no-underline black'>submit</Link>
              </div>
              }
            </div>
            <div className='flex flex-fixed'>
                  <Link to='/profile' className='ml1 no-underline black'>profile</Link>

                  <div className='ml1'>|</div>
                  {userId ?
                    <div className='ml1 pointer black' onClick={() => {
                      localStorage.removeItem(GC_USER_ID)
                      localStorage.removeItem(GC_AUTH_TOKEN)
                      this.props.history.push(`/new/1`)
                    }}>logout</div>
                    :
                    <Link to='/login' className='ml1 no-underline black'>login</Link>
                  }
            </div>
          </div>
      </div>


    )
  }

}

export default withRouter(Header)
