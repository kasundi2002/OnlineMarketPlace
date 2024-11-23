import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, Paper } from '@mui/material';
import { format } from 'date-fns';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import authAxios from '../../../../utils/authAxios';
// import { toast } from 'react-toastify';

function createData(id, title, pubDate, pubTime, status) {
    return { id, title, pubDate, pubTime, status };
}

const rows = [
    createData(1, 'Study Reveals Surprising Insights into Sleep Patterns', '2024-03-15', '09:00', 'pending'),
    createData(2, 'Breaking', '2024-03-16', '10:00', 'pending'),
    createData(3, 'Tech Guru Bob Johnson Launches Groundbreaking Startup', '2024-03-17', '11:00', 'pending'),
    createData(4, 'Alice Williams Nominated for Environmental Activism Award', '2024-03-18', '12:00', 'pending'),
    createData(5, 'Eve Browns New Book Takes Literary World by Storm', '2024-03-19', '13:00', 'pending'),
];

const ManageNewsFeed = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [news, setNews] = useState([]);

    const getNews = async () => {
        try {
            const res = await authAxios.get(`http://localhost:3001/api/news/`);
            setNews(res.data);
            console.log(res.data)
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                console.error('Products not found');
            } else {
                console.error(error.response?.data?.message || 'An error occurred');
            }
        }
    };

    useEffect(() => {
        getNews();
    }, []);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const result = await authAxios.put(`http://localhost:3001/api/news/${id}`, { status: newStatus });
            if (result) {
                getNews();
                //console.success('Updated Successfully');
            }
        } catch (error) {
            //console.error(error.response.data.message);
        }
    };

    const [regUsers] = useState(100); // Example value
    const [staff] = useState(20); // Example value
    const currentDate = format(new Date(), 'MMMM dd, yyyy');

    return (
        <>
            
            <br/><br/>
            <div className="flex justify-center container">
                <Typography style={{ margin: '20px 0', fontSize: '32px', fontWeight: 'bold' }}>
                    News for Confirmation
                </Typography>
            </div>

            <Container maxWidth={'800px'}>
                <Paper sx={{ width: '100%', marginTop: 2 }}>
                    <TableContainer sx={{ maxHeight: '100%' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">News ID</TableCell>
                                    <TableCell align="center">Title</TableCell>
                                    <TableCell align="center">Published Date</TableCell>
                                    <TableCell align="center">Published Time</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {news.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">{row.title}</TableCell>
                                        <TableCell align="center">{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="center">{new Date(row.createdAt).toLocaleTimeString()}</TableCell>
                                        <TableCell align="center">
                                            <ToggleButtonGroup
                                                value={row.status}
                                                exclusive
                                                onChange={(event, newStatus) => handleStatusChange(row._id, newStatus)}
                                                aria-label="status"
                                                size="small"
                                            >
                                                <ToggleButton value="pending">Pending</ToggleButton>
                                                <ToggleButton value="active">Active</ToggleButton>
                                            </ToggleButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[15, 25, 100]} // Include 3 as an option
                        component="div"
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
        </>
    );
};

export default ManageNewsFeed;