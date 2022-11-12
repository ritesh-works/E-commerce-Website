const Order = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name price")//TODO: will be explained later
    .exec((err, order) => {
        if( err || !order)
            return res.status(400).json({
                error: "No order was found in DB"
            });
        req.order = order;
        next();
    });
};

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;//because we have used User model in Order model. hence Order is dependent on user and profile gets populated due to param getUserById
    const order = new Order(req.body.order);//TODO: why req.body.order
    order.save((err, order) => {
        if(err)
            return res.status(400).json({
                error: "Not able to save order in DB"
            });
        res.json(order);
    });
};

exports.getAllOrders = (_req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err)
            return res.status(400).json({
                error: "No order found"
            });
        res.json(order);
    });
};

exports.getOrderStatus = (_req, res) => {
    res.json(Order.schema.path("status").enumValues);//TODO: will be explained later
};

exports.updateStatus = (req, res) => {
    Order.findByIdAndUpdate(
        { _id: req.body.orderId },
        /*req.body is coming from frontend so it does not have to do with schema. You can name it anything on front end 
        when you are writing req.body.orderId means you are mentioning the payload of your api,
        from frontend orderId will be given as a api payload so after getting this payload you are mentioning this line
        { _id: req.body.orderId } it means you are querying to the order schema for _id using the payload orderId*/
        { $set: {status: req.body.status} },
        (err, order) => {
            if(err)
                return res.status(400).json({
                    error: "Cannot update order status"
                });
            res.json(order);
        }
    );
};