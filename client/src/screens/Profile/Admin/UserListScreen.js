import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import { listUsers, deleteUser } from "../../../actions/userAction";
import DropNotif from "../../../components/Modal/Modal";
import { USER_DELETE_RESET } from "../../../constants/userConstants";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const UserListScreen = ({ history }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete, error: errorDelete } = userDelete;


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = users ? users.filter(users =>
    users.name.toLowerCase().includes(searchQuery.toLowerCase())
  ):[];

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate("/login");
    }
  }, [dispatch, history, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteUser(id));
    }
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    let pageHeight = doc.internal.pageSize.height;
    let y = 20; // Initial y position
  
    // Add heading
    doc.setFontSize(20);
    doc.text('Users', 105, y, { align: 'center' });

    y += 10;
  
    // Generate table
    doc.autoTable({
      head: [['ID', 'Name', 'email', 'Admon', 'Seller']],
      body: filteredItems.map(row => [row._id, row.name, row.email, row.isAdmin, row.isSeller]),
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
    <>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
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
          {successDelete && (
            <DropNotif
              heading="Delete user"
              text="Delete user successfully"
              resetData={() => {
                dispatch(listUsers());
                dispatch({ type: USER_DELETE_RESET });
              }}
            ></DropNotif>
          )}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>SELLER</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {user.isSeller ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
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
export default UserListScreen;
