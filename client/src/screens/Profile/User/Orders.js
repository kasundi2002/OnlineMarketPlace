import React, { useEffect, useState } from "react";
import Message from "../../../components/Message";
import { listMyOrders } from "../../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../../../components/Loader";

import { Box, IconButton, } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Orders = () => {
  const dispatch = useDispatch();
  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading, error, orders } = orderMyList;

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);



  const [searchQuery, setSearchQuery] = useState('');
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = orders ? orders.filter(orders =>
    orders.createdAt.substring(0, 10).toLowerCase().includes(searchQuery.toLowerCase())
  ):[];

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    let pageHeight = doc.internal.pageSize.height;
    let y = 20; // Initial y position
  
    // Add heading
    doc.setFontSize(20);
    doc.text('Transaction History', 105, y, { align: 'center' });

    y += 10;
  
    // Generate table
    doc.autoTable({
      head: [['ID', 'Date', 'Price', 'Paid', 'Delevered']],
      body: filteredItems.map(row => [row._id, row.createdAt.substring(0, 10), row.totalPrice, row.isPaid, row.isDelivered]),
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
    doc.save('TransactionHistory.pdf');
  };



  let order;
  if (orders) {
    if (orders.length === 0) {
      order = (
        <>
          <Message>No Products Ordered</Message>
          <h1>Make a new Purchase now!</h1>

          <LinkContainer to={`/shop`}>
            <Button className="btn-sm">Shop now</Button>
          </LinkContainer>
        </>
      );
    } else {
      order = (
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
              placeholder="Search by date…"
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
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm">Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      );
    }
  }
  return (
    <>
      {loading && <Loader />}
      {error && <Message>{error}</Message>}
      <div>{order}</div>
    </>
  );
};

export default Orders;
