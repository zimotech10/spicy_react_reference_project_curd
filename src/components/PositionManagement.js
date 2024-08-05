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
} from '@mui/material';

const PositionManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [positions, setPosition] = useState([]);

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchAccounts();
        }
        setLoading(false);
    }, [token, navigate]);

    const fetchAccounts = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getPositions`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setPosition(res.data.positions);
            })
            .catch((err) => {
                console.log('Error fetching accounts', err);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    return (
        <Container
            style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}
        >
            <Box flexGrow={1}>
                <Typography
                    variant="h4"
                    style={{
                        marginLeft: '10%',
                        color: 'white',
                        fontFamily: 'nycd',
                        fontWeight: '1000',
                        marginBottom: '20px',
                    }}
                >
                    Position Management
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
                    <TableContainer component={Paper} style={{ width: '110%' }}>
                        <Table style={{ backgroundColor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow
                                    style={{
                                        backgroundColor: 'rgb(13, 191, 150)',
                                        color: '#fff',
                                    }}
                                >
                                    <TableCell style={{ color: '#fff' }}>
                                        UserID
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Type
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Size
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        SymbolID
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Status
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        StartPrice
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        StopPrice
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        StopLoss
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        TakeProfit
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Commission
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        RealProfit
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        CloseReason
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        CreatedAt
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {positions &&
                                    positions.map((position) => (
                                        <TableRow key={position.id}>
                                            <TableCell>
                                                {position.userID}
                                            </TableCell>
                                            <TableCell>
                                                {position.type}
                                            </TableCell>
                                            <TableCell>
                                                {position.size}
                                            </TableCell>
                                            <TableCell>
                                                {position.symbol}
                                            </TableCell>
                                            <TableCell>
                                                {position.status}
                                            </TableCell>
                                            <TableCell>
                                                {position.startPrice}
                                            </TableCell>
                                            <TableCell>
                                                {position.stopPrice}
                                            </TableCell>
                                            <TableCell>
                                                {position.stopLoss}
                                            </TableCell>
                                            <TableCell>
                                                {position.takeProfit}
                                            </TableCell>
                                            <TableCell>
                                                {position.commission}
                                            </TableCell>
                                            <TableCell>
                                                {position.realProfit}
                                            </TableCell>
                                            <TableCell>
                                                {position.closeReason}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(position.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default PositionManagement;
