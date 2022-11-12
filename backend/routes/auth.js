const express = require("express");
const router = express.Router();
const {check} = require("express-validator");//if check without curly braces then error check is not a function
const {signout, signup, signin} = require('../controllers/auth');

router.post("/signup", [
    check("name", "name should be atleast 3 characters").isLength({min: 3}),
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast 8 characters").isLength({min: 3})
],
signup);//validation could be written inside controller too

router.post("/signin", [
    check("email", "email is required").isEmail(),
    check("password", "password is required").isLength({min: 3})
],
signin);

router.get("/signout", signout);

/*
router.get("/testroute", isSignedIn, (req,res)=>{
    res.send({
        auth: req.auth,
        message: "A protected route" 
    });    
});
*/

module.exports = router;