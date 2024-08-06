import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config';
import { useNavigate } from 'react-router-dom';

import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Select,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const SymbolManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [symbols, setSymbol] = useState([]);
    const [assetNames, setAssetName] = useState([]);

    // Modal States
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [newSymbol, setNewSymbol] = useState({
        name: '',
        type: '',
        code: '',
        assetName: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchSymbols();
        }
        setLoading(false);
    }, [token]);

    const fetchSymbols = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getSymbols`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setSymbol(res.data.symbols);
                setAssetName(res.data.assetNames);
            })
            .catch((err) => {
                console.log('Error fetching symbols', err);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const validate = () => {
        // const tempErrors = {};
        // if (!newSymbol.email || !newSymbol.email.includes('@')) {
        //     tempErrors.email = 'Email is required and must include "@"';
        // }

        // Check if password is strong
        // if (!newSymbol.password || newSymbol.password.length < 8) {
        //     tempErrors.password = 'Password must be at least 8 characters long';
        // }

        // Check if passwords match
        // if (newSymbol.password !== newSymbol.confirmPassword) {
        //     tempErrors.confirmPassword = 'Passwords do not match';
        // }

        // setErrors(tempErrors);
        // return Object.keys(tempErrors).length === 0;
        return true;
    };

    const handleCreateSymbol = async () => {
        if (validate()) {
            // Reset the form
            await axios
                .post(`${config.BackendEndpoint}/createSymbol`, newSymbol, {
                    headers: {
                        Authorization: token ? token : '',
                    },
                })
                .then((res) => {
                    fetchSymbols();
                })
                .catch((error) => {});
            setOpenCreateModal(false);
        }
    };

    const handleEditSymbol = (symbol) => {
        symbol = { ...symbol, symbolId: symbol.id };
        setOpenEditModal(true);
        setSelectedSymbol(symbol);
    };

    const handleUpdateSymbol = async () => {
        // Logic for updating symbol information
        await axios
            .post(
                `${config.BackendEndpoint}/updateSymbol`,
                {
                    ...selectedSymbol,
                },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchSymbols();
            })
            .catch((error) => {});
        setOpenCreateModal(false);
        setOpenEditModal(false);
        setSelectedSymbol(null); // Clear selected symbol
    };

    const handleDeleteSymbol = async () => {
        await axios
            .post(
                `${config.BackendEndpoint}/deleteSymbol`,
                { symbolId: selectedSymbol.id },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchSymbols();
                setOpenDeleteModal(false);
            })
            .catch((error) => {});
        setOpenCreateModal(false);
    };

    const handleConfirmDelete = (symbol) => {
        // Logic for deleting symbol
        setSelectedSymbol(symbol);
        setOpenDeleteModal(true);
    };

    return (
        <Container
            style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}
        >
            <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
            >
                <Typography
                    variant="h4"
                    style={{
                        marginLeft: '20vw',
                        color: 'white',
                        fontFamily: 'nycd',
                        fontWeight: '1000',
                    }}
                >
                    Symbol Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreateModal(true)}
                    style={{ marginBottom: '20px', marginTop: '20px' }}
                >
                    Create Symbol
                </Button>

                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="200px"
                    >
                        <CircularProgress />
                    </Box>
                ) : symbols.length > 0 ? ( // Ensure symbols is not empty
                    <TableContainer component={Paper} style={{ width: '100%' }}>
                        <Table style={{ backgroundColor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow
                                    style={{
                                        backgroundColor: 'rgb(13, 191, 150)',
                                        color: '#fff',
                                    }}
                                >
                                    <TableCell style={{ color: '#fff' }}>
                                        Name
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Type
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Code
                                    </TableCell>

                                    <TableCell style={{ color: '#fff' }}>
                                        AssetName
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        CreateAt
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {symbols.map((symbol) => (
                                    <TableRow key={symbol.id}>
                                        <TableCell>{symbol.name}</TableCell>
                                        <TableCell>{symbol.type}</TableCell>
                                        <TableCell>{symbol.code}</TableCell>
                                        <TableCell>
                                            {symbol.assetName}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(symbol.createdAt)}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    handleEditSymbol(symbol)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleConfirmDelete(symbol)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" style={{ color: 'white' }}>
                        No symbol found.
                    </Typography>
                )}
            </Box>

            {/* Create symbol Modal */}
            <Dialog
                open={openCreateModal}
                onClose={() => {
                    setOpenCreateModal(false);
                    setNewSymbol({
                        name: '',
                        type: '',
                        code: '',
                        assetName: '',
                    });
                }}
            >
                <DialogTitle>Create Symbol</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newSymbol.name}
                        onChange={(e) =>
                            setNewSymbol({ ...newSymbol, name: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Type"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newSymbol.type}
                        onChange={(e) =>
                            setNewSymbol({ ...newSymbol, type: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newSymbol.code}
                        onChange={(e) =>
                            setNewSymbol({ ...newSymbol, code: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    <Select
                        fullWidth
                        value={newSymbol.assetName}
                        onChange={(e) => {
                            setNewSymbol({
                                ...newSymbol,
                                assetName: e.target.value,
                            });
                        }}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            <em>Select an asset name.</em>
                        </MenuItem>
                        {assetNames &&
                            assetNames.map((name, index) => {
                                return (
                                    <MenuItem key={index} value={name}>
                                        {name}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenCreateModal(false);
                            setNewSymbol({
                                name: '',
                                type: '',
                                code: '',
                                assetName: '',
                            });
                        }}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSymbol} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Symbol Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
            >
                <DialogTitle>Edit Symbol</DialogTitle>
                <DialogContent>
                    {selectedSymbol && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.name}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        name: e.target.value,
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Type"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.type}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        type: e.target.value,
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Code"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.code}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        code: e.target.value,
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />

                            <Select
                                fullWidth
                                value={selectedSymbol.assetName}
                                onChange={(e) => {
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        assetName: e.target.value,
                                    });
                                }}
                            >
                                {assetNames &&
                                    assetNames.map((name, index) => (
                                        <MenuItem key={index} value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenEditModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSymbol} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this symbol?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteSymbol} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SymbolManagement;
