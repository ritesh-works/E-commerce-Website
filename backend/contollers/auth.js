const User = require("../models/user")//good practice to use same name as given during export
const {validationResult} = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
    /*
    console.log("REQ BODY", req.body);//req.body has access to all the response
    res.json({
    message: "User signed up"
    */
    const errors = validationResult(req)//express-validator binds validation results to req
    if(!errors.isEmpty())
        return res.status(422).json({
            error: errors.array()[0].msg//array has location, msg and param 
        });
    const user = new User(req.body);//User is a class and req.body passed to a constructor
    user.save((err, user) => {//call back takes 2 arguments- error and object itself
        if(err)
        return res.status(400).json({//error code 400: bad request
            error: "Not able to save msg in DB"//json given to help frontend developers
        });
        //res.json(user); if we want complete data of user
        //not res.send as response is not sent to browser but to db
        res.json({
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            encry_password: user.encry_password,
            id: user._id
        });
    });
};

exports.signin = (req, res) => {
    const {email, password} = req.body;//Destructuring
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            error: errors.array()[0].msg 
        });
    }
    User.findOne({email}, (err, user) => {//finds the first occurence and any variable name can be used in place of user 
        if(err || !user)
            return res.status(400).json({
                error: "Email not found"
            });
        if(!user.authenticate(password))
            return res.status(401).json({//can use else statment if don't want to use return
                message: "Password doesn't match"
            });
        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)//can be created on any key value pair and any literal string
        //put token in cookie
        res.cookie("token", token, {expire: new Date() + 9999 });//key,value,expiry
        //send response to frontend
        const { _id, name, email} = user;//destructuring or use above method as in signup
        res.json({
            token,//automatically takes key value with "token" as key
            user: {_id, name, email}//TODO: change name to fullname
        });
        //for password, write only 'password' as we are taking this password from req body and user.password doesn't exist in db
    });
};

exports.signout = (_req, res) => {
    res.clearCookie("token");//we are getting all these methods due to cookie parser
    res.json({ //send json response or normal res.send(msg)
    message: "User signed out"
    });
};

/*
exports.getEmail = (req, res)=>{
    const {name} = req.body;
    User.findOne({name}, (_err, user) => res.send(user.email));
};
*/

//protected routes
exports.isSignedIn = expressJwt({//it will give "UnauthorizedError: No authorization token was found" 
    //if correct token value is not put in header, means out route is protected (and to genreate token user has to be logged in)
    secret: process.env.SECRET,
    userProperty: "auth",//auth contains _id and auth is accessed by req.auth
});
//Although isSignedIn is a middleware but we are not writing next() bacause next() is already covered in expressJwt 

//custom middlewares
exports.isAuthenticated = (req, res, next) =>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;//req.profile is set in userId param
    if(!checker)                                            //if === then error as both are different objects but values same
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    next();
};

exports.isAdmin = (req, res, next) =>{
    if(req.profile.role === 0)
        return res.status(403).json({
            error: "You are not admin, ACCESS DENIED"
        });
    next();
};