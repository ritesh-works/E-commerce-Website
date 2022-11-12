const express = require("express");
const router = express.Router();
const {getUserById, getUser, getAllUsers, updateUser, userPurchaseList} = require("../controllers/user");
const {isSignedIn, isAuthenticated} = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);//user must be signed in and then authenticated then only he will get his data present in profile
//getUserbyId is triggered by router.get() as it has same param :UserId
router.get("/users", getAllUsers);
router.put("/user/:userId",  isSignedIn, isAuthenticated, updateUser);
router.get("/user/orders/:userId",  isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
