import React, { useState } from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Home from '@mui/icons-material/Home';
import Explore from '@mui/icons-material/Explore';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import { useDispatch,useSelector } from 'react-redux';
import { setTheme } from '../../state';
import { useNavigate } from 'react-router-dom';

export default function AccountMenu({setOpenLogoutModal}) {
  const navigate=useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUser=useSelector((state)=>state.currentUser);
  const open = Boolean(anchorEl);

  const theme=useSelector((state)=>state.theme);
    const dispatch=useDispatch();
    const handleTheme=()=>{
        document.body.style.transition = "background-color 0.5s";
        dispatch(setTheme());
    }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src={currentUser.profilePicture.url} sx={{ width: 32, height: 32 }}/>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            bgcolor: theme==="dark"?"var(--darkWigetSecondary)":"var(--lightWigetSecondary)", 
            color: theme==="dark"?"var(--darkTextPrimary)":"var(--lightTextPrimary)", 
            borderRadius: '10px',
            transition: '3s',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: theme==="dark"?"var(--darkWigetSecondary)":"var(--lightWigetPrimary)", 
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: -11,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={()=>navigate('/')}>
          <ListItemIcon sx={{color: theme==="dark"?"var(--darkTextPrimary)":"var(--lightTextPrimary)", }}>
            <Home fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>
        <MenuItem onClick={()=>navigate('/explore')}>
          <ListItemIcon sx={{color: theme==="dark"?"var(--darkTextPrimary)":"var(--lightTextPrimary)", }}>
            <Explore fontSize="small" />
          </ListItemIcon>
          Explore
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleTheme}>
          <ListItemIcon sx={{color: theme==="dark"?"var(--darkTextPrimary)":"var(--lightTextPrimary)", }}>
            {theme==="dark"?<LightModeIcon/>:<DarkModeIcon/>}
          </ListItemIcon>
          {theme==="dark"?"Light":"Dark"}
        </MenuItem>
        <MenuItem onClick={()=>setOpenLogoutModal(true)}>
          <ListItemIcon sx={{color: theme==="dark"?"var(--darkTextPrimary)":"var(--lightTextPrimary)", }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
