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
    Paper,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';

const Commissions = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('adminTrade');
    const [symbols, setSymbol] = useState([]);

    // Modal States
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchSymbols();
        }
    }, [token]);

    const fetchSymbols = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${config.BackendEndpoint}/getCommissions`,
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            );
            setSymbol(res.data.commissions);
        } catch (err) {
            console.log('Error fetching company', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const validate = () => {
        // Validation logic...
        return true;
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
                    Commissions
                </Typography>

                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="200px"
                    >
                        <CircularProgress />
                    </Box>
                ) : (
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
                                        CompanyEmail
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Major
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        JPY pairs
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Indices
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Metal
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Oil
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        BTC/USD
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        CreatedAt
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        UpdateAt
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {symbols.length > 0 ? (
                                    symbols.map((symbol) => (
                                        <TableRow key={symbol.id}>
                                            <TableCell>
                                                {symbol.companyEmail}
                                            </TableCell>
                                            <TableCell>
                                                {symbol.Major}
                                            </TableCell>
                                            <TableCell>
                                                {symbol.JPYpairs}
                                            </TableCell>
                                            <TableCell>
                                                {symbol.Indices}
                                            </TableCell>
                                            <TableCell>
                                                {symbol.Metal}
                                            </TableCell>
                                            <TableCell>{symbol.Oil}</TableCell>
                                            <TableCell>
                                                {symbol.BTCUSD}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(symbol.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(symbol.updatedAt)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            style={{ textAlign: 'center' }}
                                        >
                                            No symbols found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Commissions;
