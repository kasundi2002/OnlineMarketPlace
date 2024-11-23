import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, InputBase, FormControl, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import authAxios from '../../../../utils/authAxios';
import Loader from '../../../../components/Loader';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ShopManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updateFormData, setUpdateFormData] = useState({
    _id: '',
    name: '',
    description: '',
    logo: '',
    category: [],
    title: 'Shop With Us'
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

  const handleUpdateShop = (shop) => {
    setOpenUpdateDialog(true);
    setUpdateFormData(shop);
  };

  const handleDeleteShop = async (id) => {
    try {
      const result = await authAxios.delete(`http://localhost:3001/api/shops/${id}`);
      if (result) {
        getShops();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await authAxios.put(`http://localhost:3001/api/shops/${updateFormData._id}`, updateFormData);
      if (result) {
        getShops();
        handleDialogClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getShops = async () => {
    try {
      const res = await authAxios.get(`http://localhost:3001/api/shops/`);
      setShops(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getShops();
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    let pageHeight = doc.internal.pageSize.height;
    let y = 20; // Initial y position
  
    // Add heading
    doc.setFontSize(20);
    doc.text('All shop details', 105, y, { align: 'center' });

    y += 10;
  
    // Generate table
    doc.autoTable({
      head: [['Name', 'Title', 'Description']],
      body: filteredShops.map(row => [row.name, row.title, row.description]),
      startY: y + 10,
      theme: 'grid', // Add table styling
      didDrawPage: function(data) {
        // Footer
        let pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(190, pageHeight - 10, 'Page ' + doc.internal.getCurrentPageInfo().pageNumber + ' of ' + totalPagesExp);
      }
    });
  
    // Save the PDF
    doc.save('current_news.pdf');
  };

  return (
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
        {!isLoading ? (
          <>
            <TableContainer sx={{ maxHeight: '100%' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Logo</TableCell>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredShops.map((shop) => (
                    <TableRow key={shop._id}>
                      <TableCell align="center">{shop.name}</TableCell>
                      <TableCell align="center">{shop.description}</TableCell>
                      <TableCell align="center">
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          style={{ width: '35px', height: '35px', margin: 'auto' }}
                        />
                      </TableCell>
                      <TableCell align="center">{shop.category.join(', ')}</TableCell>
                      <TableCell align="center">
                        <Button variant="outlined" sx={{ marginRight: 2 }} color="success" onClick={() => handleUpdateShop(shop)}>
                          Update
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteShop(shop._id)}>
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
          </>
        ) : (
          <Loader />
        )}
      </Paper>

      <Dialog open={openUpdateDialog} onClose={handleDialogClose}>
        <DialogTitle>Update Shop</DialogTitle>
        <DialogContent>
          <TextField
            required
            id="outlined-read-only-input"
            label="Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={updateFormData.name}
            onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            value={updateFormData.description}
            onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
          />
          <TextField
            required
            id="outlined-read-only-input"
            label="Logo"
            fullWidth
            margin="normal"
            variant="outlined"
            value={updateFormData.logo}
            onChange={(e) => setUpdateFormData({ ...updateFormData, logo: e.target.value })}
          />
          <TextField
            id="outlined-select-category"
            select
            label="Category"
            value={updateFormData.category}
            onChange={(e) => setUpdateFormData({ ...updateFormData, category: e.target.value })}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            {/* You can populate categories dynamically */}
            <MenuItem value={'Category 1'}>Category 1</MenuItem>
            <MenuItem value={'Category 2'}>Category 2</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary">Save</Button>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShopManagement;
