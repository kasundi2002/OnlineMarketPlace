// shopActions.js
import axios from "axios";
import {
  SHOP_BY_SELLER_REQUEST,
  SHOP_BY_SELLER_SUCCESS,
  SHOP_BY_SELLER_FAIL,
} from "../constants/shopConstants";

export const getShopBySeller = (sellerId) => async (dispatch) => {
  try {
    dispatch({ type: SHOP_BY_SELLER_REQUEST });

    const { data } = await axios.get(`/api/shops/seller/${sellerId}`);

    dispatch({
      type: SHOP_BY_SELLER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SHOP_BY_SELLER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
