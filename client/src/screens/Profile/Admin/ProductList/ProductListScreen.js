import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../../components/Message";
import Loader from "../../../../components/Loader";
import { Pagination } from "@mui/material";
import {
  getProducts,
  getProductsForSeller,
} from "../../../../actions/productActions";
import { deleteProduct } from "../../../../actions/productActions";
import DropNotif from "../../../../components/Modal/Modal";
import { PRODUCT_DELETE_RESET } from "../../../../constants/productConstants";
import { getUserDetails } from '../../../../actions/userAction';

import { Box, IconButton, } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ProductListScreen = ({ history }) => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const productAll = useSelector((state) => state.productAll);
  const { loading, error, products, pageCount } = productAll;

  const productForSeller = useSelector((state) => state.productForSeller);
  const {
    loading: loadingForSeller,
    error: errorForSeller,
    products: productsSeller,
  } = productForSeller;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;

  useEffect(() => {
    if (userInfo.isAdmin) {
      dispatch(getProducts("", "", "", "", "", page));
    } else if (userInfo.isSeller && !userInfo.isAdmin) {
      dispatch(getProductsForSeller());
    }
  }, [dispatch, page, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };
  const pageHandler = (e, value) => {
    setPage(value);
  };

  const [productsFinal, setProductsFinal] = useState();
  
  useEffect(() => {
    let finalProducts = null;
    if (userInfo.isAdmin) {
      finalProducts = products;
    } else if (userInfo.isSeller) {
      finalProducts = productsSeller;
    }
    if (finalProducts) {
      setProductsFinal(finalProducts);
    }
  }, [userInfo, products, productsSeller]);
  

  console.log(productsFinal);

 
  const [sid, setSid] = useState("");
  const userDetail = useSelector((state) => state.userDetail);
  const { user } = userDetail;
  const [visible, setVisible] = useState("");

  

  useEffect(() => {
    if (!user || !user.name) {
      dispatch(getUserDetails("profile"));
    } else {
      setSid(user._id);
      if(user.brandName == "No"){
        setVisible("d-none");
      }
    }
  }, [history, userInfo, dispatch, user]);


  const [searchQuery, setSearchQuery] = useState('');
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = productsFinal ? productsFinal.filter(productsFinal =>
    productsFinal.name.toLowerCase().includes(searchQuery.toLowerCase())
  ):[];

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const totalPagesExp = '{total_pages_count_string}';
    let pageHeight = doc.internal.pageSize.height;
    let y = 20; // Initial y position
  
    // Add heading
    doc.setFontSize(20);
    doc.text('Products', 105, y, { align: 'center' });

    y += 10;
  
    // Generate table
    doc.autoTable({
      head: [['ID', 'Name', 'Price', 'Category', 'Brand', 'Rating', 'InStock']],
      body: filteredItems.map(row => [row._id, row.name, row.price, row.category, row.brand, row.rating, row.countInStock]),
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
    doc.save('Products.pdf');
  };

  return (
    <Container className="mb-5">
      <Row className={`align-items-center ${visible}`}>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Link
            className="my-3 btn btn-primary"
            to="/admin/product/create"
            style={{ marginLeft: "auto" }}
          >
            <i className="fas fa-plus"></i> Create Product
          </Link>
        </Col>
      </Row>
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
          {loadingDelete && <Loader />}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          {successDelete && (
            <DropNotif
              heading="Delete Product"
              text="Delete product successfully"
              resetData={() => {
                if (userInfo.isAdmin) {
                  dispatch(getProducts("", "", "", "", "", page));
                } else if (userInfo.isSeller && !userInfo.isAdmin) {
                  dispatch(getProductsForSeller());
                }
                dispatch({ type: PRODUCT_DELETE_RESET });
              }}
            />
          )}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>RATING</th>
                <th>IN STOCK</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems &&
                filteredItems.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{product.rating}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Pagination
            count={pageCount}
            size="large"
            page={page}
            onChange={pageHandler}
          />
        </>
      )}
    </Container>
  );
};

export default ProductListScreen;
