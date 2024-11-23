// shopReducers.js
import {
    SHOP_BY_SELLER_REQUEST,
    SHOP_BY_SELLER_SUCCESS,
    SHOP_BY_SELLER_FAIL,
  } from "../constants/shopConstants";
  
  export const shopBySellerReducer = (state = { shop: {} }, action) => {
    switch (action.type) {
      case SHOP_BY_SELLER_REQUEST:
        return { loading: true, shop: {} };
      case SHOP_BY_SELLER_SUCCESS:
        return { loading: false, shop: action.payload };
      case SHOP_BY_SELLER_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  