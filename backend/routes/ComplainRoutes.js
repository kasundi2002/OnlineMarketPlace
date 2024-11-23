const express = require("express");
const complainRouter = express.Router();
const { 
    createComplain, 
    getAllComplains, 
    deleteComplain, 
    updateComplain, 
    getOneComplain
} = require('../controller/ComplainController.js');

complainRouter
    .route("/")
    .post(createComplain)
    .get(getAllComplains);

complainRouter.get('/:id', getOneComplain);
complainRouter.delete('/:id', deleteComplain);
complainRouter.put('/:id', updateComplain);

module.exports = complainRouter;
