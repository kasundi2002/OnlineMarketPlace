const express = require("express");
const shopRouter = express.Router();
const { 
    createShop, 
    getAllShops, 
    deleteShop, 
    updateShop, 
    getOneShop,
    getOneShopBySeller
} = require ('../controller/ShopController.js');

shopRouter
    .route("/")
    .post(createShop)
    .get(getAllShops);

shopRouter.get('/:id', getOneShop);
shopRouter.get('/seller/:id', getOneShopBySeller);
shopRouter.delete('/:id', deleteShop);
shopRouter.put('/:id', updateShop);

module.exports = shopRouter;
