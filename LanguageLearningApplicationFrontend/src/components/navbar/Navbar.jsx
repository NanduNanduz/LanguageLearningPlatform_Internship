import { AppBar, Box, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Hidden } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <List>
      <ListItem button component={Link} to={'/'}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to={'/login'}>
        <ListItemText primary="Login" />
      </ListItem>
      <ListItem button component={Link} to={'/signup'}>
        <ListItemText primary="Signup" />
      </ListItem>
    </List>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className='bg-transparent shadow-none pb-2' >
        <Toolbar>
          <img src="/Images/video-editing-app.png" alt="" style={{width:'50px'}} className='mt-2 me-3' />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='mt-3'>
            CINESTREAM
          </Typography>
          <Hidden mdUp>
            <IconButton edge="end" color="inherit" onClick={toggleDrawer}>
              <span className="material-icons "><img style={{width:"20px"}} src="https://img.icons8.com/?size=100&id=dMz54mFbVirR&format=png&color=000000" alt="icon" /></span>
            </IconButton>
            <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer}>
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden mdDown >
            <Link to={'/'}><Button color="inherit">Home</Button></Link>
            <Link to={'/login'}><Button color="inherit">Login</Button></Link>
            <Link to={'/signup'}><Button color="inherit">Signup</Button></Link>
          </Hidden>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
