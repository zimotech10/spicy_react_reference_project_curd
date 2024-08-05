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
    OutlinedInput,
    Switch,
    FormControlLabel,
    Snackbar,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const UserManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [accounts, setAccounts] = useState([]);
    const [selectedAllow, setSelectedAllow] = useState({});

    // Modal States
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({ allow: 'Block' });
    const [newUser, setNewUser] = useState({
        email: '',
        userName: '',
        balance: '',
        leverage: '',
        margin: '',
        server: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchAccounts();
        }
        setLoading(false);
    }, [token]);

    const fetchAccounts = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getUsers`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setAccounts(res.data.users || []);
            })
            .catch((err) => {
                console.log('Error fetching accounts', err);
            });
    };

    const handleToggle = (event) => {
        setSelectedUser({
            ...selectedUser,
            allow: event.target.checked ? 'Allow' : 'Block',
        });
    };

    const validate = () => {
        const tempErrors = {};
        if (!newUser.email || !newUser.email.includes('@')) {
            tempErrors.email = 'Email is required and must include "@"';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleAllowChange = (userId, newValue) => {
        setSelectedAllow((prev) => ({
            ...prev,
            [userId]: newValue,
        }));

        // Optionally, you can send the new value to the server here
        // to update the user's allow status
    };

    const handleCreateUser = async () => {
        if (validate()) {
            // Reset the form
            await axios
                .post(`${config.BackendEndpoint}/createUser`, newUser, {
                    headers: {
                        Authorization: token ? token : '',
                    },
                })
                .then((res) => {
                    fetchAccounts();
                })
                .catch((error) => {});
            setOpenCreateModal(false);
        }
    };

    const handleEditUser = (user) => {
        user = { ...user, userId: user.id };
        setSelectedUser(user);
        setOpenEditModal(true);
    };

    const handleUpdateUser = async () => {
        // Logic for updating user information
        await axios
            .post(`${config.BackendEndpoint}/updateUser`, selectedUser, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                fetchAccounts();
            })
            .catch((error) => {});
        setOpenCreateModal(false);
        setOpenEditModal(false);
        setSelectedUser(null); // Clear selected user
    };

    const handleDeleteUser = async () => {
        await axios
            .post(
                `${config.BackendEndpoint}/deleteUser`,
                { userId: selectedUser.id },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchAccounts();
                setOpenDeleteModal(false);
            })
            .catch((error) => {});
        setOpenCreateModal(false);
    };

    const handleConfirmDelete = (user) => {
        // Logic for deleting user
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
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
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreateModal(true)}
                    style={{ marginBottom: '20px', marginTop: '20px' }}
                >
                    Create User
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
                ) : accounts.length > 0 ? ( // Ensure accounts is not empty
                    <TableContainer component={Paper} style={{ width: '110%' }}>
                        <Table style={{ backgroundColor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow
                                    style={{
                                        backgroundColor: 'rgb(13, 191, 150)',
                                        color: '#fff',
                                    }}
                                >
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Email
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        UserName
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Allow
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Balance
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        UsedMargin
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        TotalProfit
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Leverage
                                    </TableCell>

                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Server
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        CreatedAt
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        UpdatedAt
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.email}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.userName}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.allow}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.balance}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.margin}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.totalProfit}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.leverage}
                                        </TableCell>

                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {account.server}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {formatDate(account.createdAt)}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            {formatDate(account.updatedAt)}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    handleEditUser(account)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleConfirmDelete(account)
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
                        No users found.
                    </Typography>
                )}
            </Box>

            {/* Create User Modal */}
            <Dialog
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            >
                <DialogTitle>Create User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newUser.email}
                        onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="dense"
                        label="UserName"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.userName}
                        onChange={(e) =>
                            setNewUser({ ...newUser, userName: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Balance"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newUser.balance}
                        onChange={(e) =>
                            setNewUser({ ...newUser, balance: e.target.value })
                        }
                    />
                    <Select
                        labelId="leverage-label"
                        value={newUser.leverage}
                        onChange={(e) => {
                            setNewUser({
                                ...newUser,
                                leverage: e.target.value,
                            });
                        }}
                        style={{ width: '100%' }}
                        displayEmpty
                        input={<OutlinedInput label="" />}
                    >
                        <MenuItem value="">
                            <span>Select Leverage</span>{' '}
                            {/* Placeholder when nothing is selected */}
                        </MenuItem>
                        {/* Leverage options */}
                        <MenuItem value={1 * 10}>1:10</MenuItem>
                        <MenuItem value={1 * 20}>1:20</MenuItem>
                        <MenuItem value={1 * 30}>1:30</MenuItem>
                        <MenuItem value={1 * 40}>1:40</MenuItem>
                        <MenuItem value={1 * 50}>1:50</MenuItem>
                        <MenuItem value={1 * 60}>1:60</MenuItem>
                        <MenuItem value={1 * 100}>1:100</MenuItem>
                        <MenuItem value={1 * 200}>1:200</MenuItem>
                        <MenuItem value={1 * 500}>1:500</MenuItem>
                        <MenuItem value={1 * 1000}>1:1000</MenuItem>
                    </Select>
                    <TextField
                        margin="dense"
                        label="Used Margin"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newUser.margin}
                        onChange={(e) =>
                            setNewUser({ ...newUser, margin: e.target.value })
                        }
                    />

                    <TextField
                        margin="dense"
                        label="Server"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.server}
                        onChange={(e) =>
                            setNewUser({ ...newUser, server: e.target.value })
                        }
                        error={!!errors.server}
                        helperText={errors.server}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenCreateModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreateUser} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
            >
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={selectedUser.email}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />
                            <TextField
                                margin="dense"
                                label="UserName"
                                type="text"
                                fullWidth
                                required
                                variant="outlined"
                                value={selectedUser.userName}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        userName: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                margin="dense"
                                label="password"
                                type="text"
                                fullWidth
                                required
                                variant="outlined"
                                // value={selectedUser.password}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        password: e.target.value,
                                    })
                                }
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={selectedUser.allow === 'Allow'}
                                        onChange={handleToggle}
                                        name="allowToggle"
                                    />
                                }
                                label={selectedUser.allow}
                            />

                            <TextField
                                margin="dense"
                                label="Balance"
                                type="number"
                                fullWidth
                                required
                                variant="outlined"
                                value={selectedUser.balance}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        balance: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                margin="dense"
                                label="UsedMargin"
                                type="number"
                                fullWidth
                                required
                                variant="outlined"
                                value={selectedUser.margin}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        margin: e.target.value,
                                    })
                                }
                            />

                            <Select
                                labelId="leverage-label"
                                value={selectedUser.leverage}
                                onChange={(e) => {
                                    setSelectedUser({
                                        ...selectedUser,
                                        leverage: e.target.value,
                                    });
                                }}
                                style={{ width: '100%' }}
                                displayEmpty
                                input={<OutlinedInput label="" />}
                            >
                                <MenuItem value="">
                                    <span>Select Leverage</span>{' '}
                                    {/* Placeholder when nothing is selected */}
                                </MenuItem>
                                {/* Leverage options */}
                                <MenuItem value={1 * 10}>1:10</MenuItem>
                                <MenuItem value={1 * 20}>1:20</MenuItem>
                                <MenuItem value={1 * 30}>1:30</MenuItem>
                                <MenuItem value={1 * 40}>1:40</MenuItem>
                                <MenuItem value={1 * 50}>1:50</MenuItem>
                                <MenuItem value={1 * 60}>1:60</MenuItem>
                                <MenuItem value={1 * 100}>1:100</MenuItem>
                                <MenuItem value={1 * 200}>1:200</MenuItem>
                                <MenuItem value={1 * 500}>1:500</MenuItem>
                                <MenuItem value={1 * 1000}>1:1000</MenuItem>
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
                    <Button onClick={handleUpdateUser} color="primary">
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
                    Are you sure you want to delete this user?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement;
