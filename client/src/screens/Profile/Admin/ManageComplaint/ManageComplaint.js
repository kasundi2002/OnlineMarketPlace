import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import authAxios from '../../../../utils/authAxios';
import Loader from '../../../../components/Loader';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ComplainHome = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [complains, setComplains] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateFormData, setUpdateFormData] = useState({
    _id: '',
    shop: '',
    user: '',
    description: '',
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDialogClose = () => {
    setOpenUpdateDialog(false);
  };

  const handleUpdateComplain = (complain) => {
    setOpenUpdateDialog(true);
    setUpdateFormData({
      _id: complain._id,
      shop: complain.shop,
      user: complain.user,
      description: complain.description,
    });
  };

  const handleDeleteComplain = async (id) => {
    try {
      const result = await authAxios.delete(`http://localhost:3001/api/complain/${id}`);
      if (result) {
        getComplains();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await authAxios.put(`http://localhost:3001/api/complain/${updateFormData._id}`, {status: "Checked"});
      if (result) {
        getComplains();
        handleDialogClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getComplains = async () => {
    try {
      const res = await authAxios.get(`http://localhost:3001/api/complain/`);
      setComplains(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      // Handle errors
    }
  };

  useEffect(() => {
    getComplains();
  }, []);

  const filteredComplains = complains.filter(complain =>
    complain.shop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    let pageHeight = doc.internal.pageSize.height;
    let y = 20;

    doc.setFontSize(20);
    doc.text('Complains', 105, y, { align: 'center' });
    y += 10;

    doc.autoTable({
      head: [['Description', 'Shop', 'User']],
      body: filteredComplains.map(complain => [complain.description, complain.shop, complain.user]),
      startY: y + 10,
      theme: 'grid',
      didDrawPage: function(data) {
        let pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(190, pageHeight - 10, 'Page ' + doc.internal.getCurrentPageInfo().pageNumber + ' of ' + totalPagesExp);
      }
    });

    doc.save('complains.pdf');
  };

  return (
    <>
      <Container maxWidth={'800px'}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: 2,
          }}
        >
          <InputBase
            placeholder="Search…"
            sx={{ ml: 1, width: 200, border: '1px solid #ccc', borderRadius: 3, paddingLeft: 1 }}
            onChange={handleSearchChange}
          />
          <IconButton sx={{ p: '10px', marginRight: 2 }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
        <Button variant="outlined" color="primary" onClick={handleGeneratePdf}>
          Generate Pdf
        </Button>
        <Paper sx={{ width: '100%', marginTop: 2 }}>
          {
            !isLoading ? <>
              <TableContainer sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Shop</TableCell>
                      <TableCell align="center">User</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredComplains.map((complain) => (
                      <TableRow
                        key={complain._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="center"><Link to={`/shop/${complain.shop}`}>{complain.shop}</Link></TableCell>
                        <TableCell align="center">{complain.user}</TableCell>
                        <TableCell align="center">{complain.status}</TableCell>
                        <TableCell align="center">
                          <Button variant="outlined" sx={{ marginRight: 2 }} color="success" onClick={() => handleUpdateComplain(complain)}>
                            Check
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleDeleteComplain(complain._id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </> : <Loader />}
        </Paper>

        <Dialog open={openUpdateDialog} onClose={handleDialogClose}>
          <DialogTitle>Update Complain</DialogTitle>
          <DialogContent>
            {updateFormData.description}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdate} color="primary">Mark as Checked</Button>
            <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ComplainHome;
