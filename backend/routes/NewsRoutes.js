const express = require("express");
const newsRouter = express.Router();
const { 
    createNews, 
    getAllNewss, 
    deleteNews, 
    updateNews, 
    getOne} = require ('../controller/NewsController.js');


newsRouter
    .route("/")
    .post(createNews)
    .get(getAllNewss);
newsRouter.get('/:id', getOne);
newsRouter.delete('/:id', deleteNews);
newsRouter.put('/:id', updateNews);

module.exports = newsRouter;