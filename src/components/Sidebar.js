import React from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Drawer,
    IconButton,
    Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Group, EuroSymbol, MoneyTwoTone } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import ExitToApp from '@mui/icons-material/ExitToApp';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/logo.png';

const Sidebar = ({ open, onClose }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Determine selected item based on current location
    const selectedItem = location.pathname;

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the new path using react-router
        // Commented out to keep sidebar open
        // onClose(); // If you want to close it, leave this line uncommented
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('adminTrade');
        navigate('/login');
    };

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={
                open
                    ? {
                          width: 240,
                          '& .MuiDrawer-paper': {
                              width: 240,
                              boxSizing: 'border-box',
                          },
                      }
                    : ''
            }
        >
            <img src={logo} alt="Logo" height={240} width={240} />
            <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                p={2}
            ></Box>
            <List>
                {/* <ListItem
                    onClick={() => handleNavigation('/dashboard')}
                    selected={selectedItem === '/dashboard'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                        },
                    }}
                >
                     <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon> 
                     <ListItemText
                        primary="Dashboard"
                        style={{
                            fontWeight:
                                selectedItem === '/dashboard'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    /> 
                </ListItem> */}

                <ListItem
                    onClick={() => handleNavigation('/userManagement')}
                    selected={selectedItem === '/userManagement'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }} // Change cursor to pointer
                >
                    <ListItemIcon>
                        <Group />
                    </ListItemIcon>
                    <ListItemText
                        primary="Users"
                        style={{
                            fontWeight:
                                selectedItem === '/userManagement'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/symbolManagement')}
                    selected={selectedItem === '/symbolManagement'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }} // Change cursor to pointer
                >
                    <ListItemIcon>
                        <EuroSymbol />
                    </ListItemIcon>
                    <ListItemText
                        primary="Symbol"
                        style={{
                            fontWeight:
                                selectedItem === '/symbolManagement'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/positionManagement')}
                    selected={selectedItem === '/positionManagement'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }} // Change cursor to pointer
                >
                    <ListItemIcon>
                        <MoneyTwoTone />
                    </ListItemIcon>
                    <ListItemText
                        primary="Position"
                        style={{
                            fontWeight:
                                selectedItem === '/positionManagement'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/symbolAssets')}
                    selected={selectedItem === '/symbolAssets'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }} // Change cursor to pointer
                >
                    <ListItemIcon>
                        <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Symbol Aseets" />
                </ListItem>

                <ListItem
                    onClick={handleLogout}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }} // Change cursor to pointer
                >
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="LogOut" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
