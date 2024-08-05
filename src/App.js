import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import SymbolManagement from './components/SymbolManagement';
import PositionManagement from './components/PositionManagement';
import SymbolAssets from './components/SymbolAssets';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './App.css';

const App = () => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const token = localStorage.getItem('adminTrade');
    const toggleSidebar = () => {
        setOpenSidebar((prev) => !prev);
    };

    console.log('this is a sidebar', openSidebar);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setOpenSidebar(false);
            } else {
                setOpenSidebar(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially to set the correct state
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Router>
            <div style={{ display: 'flex' }}>
                {token && (
                    <>
                        <Sidebar
                            open={openSidebar}
                            onClose={() => setOpenSidebar(false)}
                            selectedItem="dashboard"
                        />
                        <div
                            className="background"
                            style={{
                                flexGrow: 1,
                                marginLeft: openSidebar ? '18px' : '0',
                                transition: 'margin-left 0.3s',
                                padding: '16px',
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    zIndex: '1',
                                    color: 'white',
                                }}
                            >
                                {!openSidebar && (
                                    <Button
                                        variant="outlined"
                                        onClick={toggleSidebar}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 1000, // Keep on top
                                        }}
                                    >
                                        {openSidebar ? (
                                            <CloseIcon />
                                        ) : (
                                            <MenuIcon />
                                        )}
                                    </Button>
                                )}
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <ProtectedRoute>
                                                <Dashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/userManagement"
                                        element={
                                            <ProtectedRoute>
                                                <UserManagement />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/symbolManagement"
                                        element={
                                            <ProtectedRoute>
                                                <SymbolManagement />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/positionManagement"
                                        element={
                                            <ProtectedRoute>
                                                <PositionManagement />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/symbolAssets"
                                        element={
                                            <ProtectedRoute>
                                                <SymbolAssets />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="/" element={<Login />} />
                                </Routes>
                            </div>
                        </div>
                    </>
                )}
                {!token && <Login />}
            </div>
        </Router>
    );
};

export default App;
