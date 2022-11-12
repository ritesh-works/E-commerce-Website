const User = require('../models/user');
const Order = require('../models/order');

exports.getUserById = (req, res, next, id) => {//id is param
    User.findById(id).exec((err, user) => {//findById() triggers the middleware findOne()
        if( err || !user)
            return res.status(400).json({
                error: "No user was found in DB"
            });
        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {
    req.profile.salt = undefined; //req.profile.salt= "" will show empty salt
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    req.profile.__v = undefined;
    /*to undefine all at once
    Object.keys(req.profile).map((key) => req.profile[key] = undefined)
    put array of fields in place of Object.keys if don't want all undefined*/
    res.json(req.profile);
};

exports.getAllUsers = (_req, res) => {
    User.find().exec((err, user) => {
        if(err || !user)
            return res.status(400).json({
                error: "No user found"
            });
        res.json(user);//user is an array of all entries
    });
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(//findByIdAndUpdate() triggers the middleware findOneAndUpdate()
//we are making a request on the route with :userId, so automatically param middleware is gonna fire up and set user in req.profile and from there we get our _id
        { _id: req.profile._id },
        { $set: req.body },//passing values which we want to update, here everything so used req.body
        { new: true, useFindAndModify: false},//new: true will return the modified document else we will get old document
        //useFindAndModify is used to avoid depracation warning
        (err, user) => {
            if(err)
                return res.status(400).json({
                    error: "You are not authorized to update"
                });
            user.salt = undefined;
            user.encry_password = undefined;
            user.__v = undefined;
            res.json(user);
        }
    );
};

/*Also could be updated below way but have to mention all the fields explicitly
exports.updateUser = (req, res) => {
    const user = req.profile;
    user.name = req.body.name;
    user.save((err, updatedUser) => {
        if(err)
            return res.status(400).json({
                error: "Failed to update"
            });
        res.json(updatedUser);
    });
};
*/

/*TODO: prevent few details from updating and update password
*/

exports.userPurchaseList = (req, res) => {
    Order.find({ _id: req.profile._id })//selecting a particular user or we can get for all users also by removing id param, can give any name to key
    .populate( "user", "_id name")//here user is from order schema and 2nd which fields of 'user' you want to bring in
    //means we are not fetching all the user data (password, role etc) into order model, just id and name
    .exec((err, order) => {
        if(err)
            return res.status(400).json({
                error: "No order in this account"
            });
        res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {//as soon as a user makes a order, this middleware update orders
    let purchases = [];
    req.body.order.products.forEach(item => {//this order object is coming from frontend which is made available using body parser so we need not create order object
       purchases.push({//TODO: will be explained later
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quanity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
       }) 
    });
    //store this in db
    User.findOneAndUpdate(
        { _id: req.profile._id },//finding on basis of id
        { $push: { purchases: purchases }},//first purchase is field and second is local purchase array that we created above
        { new: true},
        (err, purchases) => {//TODO: will be explained later
            if(err)
                return res.status(400).json({
                    error: "Unable to save purchase list"
                });
            next();
        }
    );
};





