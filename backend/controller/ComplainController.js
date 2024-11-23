const asyncHandler = require("express-async-handler");
const ComplainModel = require("../model/ComplainModel");

const createComplain = asyncHandler(async (req, res) => {
    const { shop, user, description } = req.body;
    try {
        const newComplain = await ComplainModel.create({
            shop,
            user,
            description
        });

        return res.status(201).json(newComplain);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

const getAllComplains = asyncHandler(async (req, res) => {
    try {
        const complains = await ComplainModel.find();
        res.status(200).json(complains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getOneComplain = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const complain = await ComplainModel.findById(id);
        res.status(200).json(complain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const deleteComplain = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw Error("Id can't be empty");
        }
        const deletedComplain = await ComplainModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Complain Deleted Successfully', complain: deletedComplain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const updateComplain = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (!id) {
            throw Error("Id can't be empty");
        }
        const updatedComplain = await ComplainModel.findByIdAndUpdate(id, data);
        res.status(200).json({ message: 'Complain Updated Successfully', complain: updatedComplain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createComplain,
    getAllComplains,
    getOneComplain,
    deleteComplain,
    updateComplain
};
