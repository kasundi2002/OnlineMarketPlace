import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../../components/Message";
import Loader from "../../../../components/Loader";
import { getAllRequest } from "../../../../actions/requestAction";
import authAxios from '../../../../utils/authAxios';

import { Box, IconButton, } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ManageRequestScreen = () => {
  const dispatch = useDispatch();
  const getRequestSeller = useSelector((state) => state.getRequestSeller);
  const { loading, error, request } = getRequestSeller;

  useEffect(() => {
    dispatch(getAllRequest());
  }, [dispatch]);


  const deleteHandler = async(id) => {
    if (window.confirm("Are you sure")) {
      try {
      const result = await authAxios.delete(`http://localhost:3001/api/request/${id}`);
      
      dispatch(getAllRequest());
      
    } catch (error) {
      //console.error(error.response.data.message);
    }
    }
  };


  const [searchQuery, setSearchQuery] = useState('');
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = request ? request.filter(request =>
    request._id.toLowerCase().includes(searchQuery.toLowerCase())
  ):[];

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    let pageHeight = doc.internal.pageSize.height;
    let y = 20; // Initial y position
  
    // Add heading
    doc.setFontSize(20);
    doc.text('Requests', 105, y, { align: 'center' });

    y += 10;
  
    // Generate table
    doc.autoTable({
      head: [['Request ID', 'User ID', 'User Name', 'Approved']],
      body: filteredItems.map(row => [row._id, row.user._id, row.user.name, row.approved]),
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
    doc.save('Requests.pdf');
  };


  return (
    <>
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
      <Button variant="outlined" color="primary" className='btn btn-outline-info btn-rounded' onClick={handleGeneratePdf}>
        Generate Pdf
      </Button>
      <br/>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>Approved</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((r) => (
                <tr key={r._id}>
                  <td>{r._id}</td>
                  <td>{r.user._id}</td>
                  <td>{r.user.name}</td>
                  <td>
                    {r.approved ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/request/${r._id}`}>
                      <Button variant="light" className="btn-sm">
                        Show more
                      </Button>
                    </LinkContainer>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(r._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ManageRequestScreen;

