const express = require("express");
const router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategories, updateCategory, deleteCategory} = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

//params
router.param("categoryId", getCategoryById);
router.param("userId", getUserById);
//whenever it sees userId param, its gonna populate the profile field

//actual routes
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)

router.get("/category/:categoryId", getCategory);

router.get("/categories", getAllCategories);

router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory);

module.exports = router;