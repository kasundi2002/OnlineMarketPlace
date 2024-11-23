import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../../components/Message";
import Loader from "../../../../components/Loader";
import { listOrders } from "../../../../actions/orderAction";
import { useNavigate } from "react-router-dom";
import authAxios from '../../../../utils/authAxios';


import { Box, IconButton, } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderLists = useSelector((state) => state.orderLists);
  const { loading, error, orders } = orderLists;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, history, userInfo]);


  const deleteHandler = async(id) => {
    if (window.confirm("Are you sure")) {
      try {
      const result = await authAxios.delete(`http://localhost:3001/api/order/delete/${id}`);
      
      dispatch(listOrders());
      
    } catch (error) {
      //console.error(error.response.data.message);
    }
    }
  };


  const [searchQuery, setSearchQuery] = useState('');
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = orders ? orders.filter(orders =>
    orders._id.toLowerCase().includes(searchQuery.toLowerCase())
  ):[];

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    let pageHeight = doc.internal.pageSize.height;
    let y = 20; // Initial y position
  
    // Add heading
    doc.setFontSize(20);
    doc.text('Orders', 105, y, { align: 'center' });

    y += 10;
  
    // Generate table
    doc.autoTable({
      head: [['ID', 'User', 'Date', 'Total', 'Paid', 'Delevered']],
      body: filteredItems.map(row => [row._id, row.user.name, row.createdAt.substring(0, 10), row.totalPrice, row.isPaid, row.isDelivered]),
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
    doc.save('Order.pdf');
  };


  return (
    <>
      <h1>Orders</h1>
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
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>

                <td>${order.totalPrice}</td>
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
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(order._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default OrderListScreen;
