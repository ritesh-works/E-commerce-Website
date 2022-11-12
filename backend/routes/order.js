const express = require("express");
const router = express.Router();

const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus} = require("../controllers/order");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {updateInventory} = require("../controllers/product");

router.param("orderId", getOrderById);
router.param("userId", getUserById);

router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateInventory, createOrder);
//we can also pushOrderInPurchaseList and updateInventory later, its upto the developer
router.get("/orders/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;