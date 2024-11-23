import React, { useState, useEffect } from "react";
import Details from "./Details";
import Addresses from "./Addresses";
import Orders from "./Orders";
import { useSelector } from "react-redux";
import Request from "./Request";
import { Container } from "react-bootstrap";
import classes from "../../ProductScreen/ProductScreen.module.css";
import UserListScreen from "../Admin/UserListScreen";
import ProductListScreen from "../Admin/ProductList/ProductListScreen";
import OrderListScreen from "../Admin/OrderList/OrderListScreen";
import ManageRequestScreen from "../Admin/ManageRequest/ManageRequestScreen";
import ConfirmNewsFeedScreen from "../Admin/ManageNewsFeed/ManageNewsFeed";
import ManageNewsFeedScreen from "../NewsManager/Home";
import ManageShopsScreen from "../Admin/ManageShops/ShopManagement";
import ManageComplains from "../Admin/ManageComplaint/ManageComplaint";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [history, userInfo]);

  const [selection, setSelection] = useState("1");

  const changeSelection = (e) => {
    setSelection(e.target.getAttribute("data-selection"));
  };

  let selectionShow;
  if (selection === "1") {
    selectionShow = <Details></Details>;
  } else if (selection === "2") {
    selectionShow = <Addresses />;
  } else if (selection === "3") {
    selectionShow = <Orders />;
  } else if (selection === "4") {
    selectionShow = <Request />;
  } else if (selection === "5") {
    selectionShow = <UserListScreen />;
  } else if (selection === "6") {
    selectionShow = <ProductListScreen />;
  } else if (selection === "7") {
    selectionShow = <OrderListScreen />;
  } else if (selection === "8") {
    selectionShow = <ManageRequestScreen />;
  } else if (selection === "9") {
    selectionShow = <ConfirmNewsFeedScreen />;
  } else if (selection === "10") {
    selectionShow = <ManageNewsFeedScreen />;
  } else if (selection === "11") {
    selectionShow = <ManageShopsScreen />;
  } else if (selection === "12") {
    selectionShow = <ManageComplains />;
  }

  return (
    <Container>
      <div className={classes["selection-container"]}>
        <ul className={classes.navSelection}>
          <li
            className={classes.navItem}
            data-selection="1"
            onClick={changeSelection}
          >
            User Profile
          </li>
          {userInfo && !userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="2"
              onClick={changeSelection}
            >
              User Addresses
            </li>
          )}
          {userInfo && !userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="3"
              onClick={changeSelection}
            >
              Transaction History
            </li>
          )}
          {userInfo && !userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="4"
              onClick={changeSelection}
            >
              User Requests
            </li>
          )}
          {userInfo && userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="5"
              onClick={changeSelection}
            >
              Manage Users
            </li>
          )}
          {userInfo && userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="11"
              onClick={changeSelection}
            >
              Manage Shops
            </li>
          )}
          {userInfo && (userInfo.isAdmin || userInfo.isSeller) && (
            <li
              className={classes.navItem}
              data-selection="6"
              onClick={changeSelection}
            >
              Manage Products
            </li>
          )}
          {userInfo && userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="7"
              onClick={changeSelection}
            >
              Manage Orders
            </li>
          )}
          {userInfo && userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="8"
              onClick={changeSelection}
            >
              Manage requests
            </li>
          )}
          {userInfo && userInfo.isAdmin && (
            <li
              className={classes.navItem}
              data-selection="9"
              onClick={changeSelection}
            >
              Confirm News
            </li>
          )}
          {userInfo && userInfo.isSeller && (
            <li
              className={classes.navItem}
              data-selection="10"
              onClick={changeSelection}
            >
              Manage News
            </li>
          )}
          {userInfo && userInfo.isAdmin && !userInfo.isSeller && (
            <li
              className={classes.navItem}
              data-selection="12"
              onClick={changeSelection}
            >
              Manage Complains
            </li>
          )}
        </ul>
        {selectionShow}
      </div>
      <div style={{ marginBottom: "100px" }}></div>
    </Container>
  );
};

export default UserProfile;
