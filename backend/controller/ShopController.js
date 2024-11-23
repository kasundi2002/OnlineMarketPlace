const asyncHandler = require("express-async-handler");
const ShopModel = require("../model/shopModel");

const createShop = asyncHandler(async (req, res) => {
    const { sid, name, description, logo, category } = req.body;
    try {
        const newShop = await ShopModel.create({
            sid,
            name,
            description,
            logo,
            category,
        });
        return res.status(201).json(newShop);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

const getAllShops = asyncHandler(async (req, res) => {
    try {
        const shops = await ShopModel.find();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getOneShop = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const shop = await ShopModel.findById(id);
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getOneShopBySeller = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // Extract the id parameter from req.params
        const shop = await ShopModel.findOne({ sid: id }); // Find the shop by sid
        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }
        res.status(200).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


const deleteShop = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw Error("Id can't be empty");
        }
        const deletedShop = await ShopModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Shop Deleted Successfully', shop: deletedShop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const updateShop = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        if (!id) {
            throw Error("Id can't be empty");
        }
        const updatedShop = await ShopModel.findByIdAndUpdate(id, newData);
        res.status(200).json({ message: 'Shop Updated Successfully', shop: updatedShop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createShop,
    getAllShops,
    getOneShop,
    getOneShopBySeller,
    deleteShop,
    updateShop
};
