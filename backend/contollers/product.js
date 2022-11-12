const Product = require('../models/product');
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");//inbuilt file system module in node

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")//TODO: will be explained later
    .exec((err, product) => {
        if( err)
            return res.status(400).json({
                error: "No product was found"
            });
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
    if(err)
        return res.status(400).json({
            error: "Problem with image"
        });
    //destructure the field
    const {name, description, price, category, stock} = fields;

    if(!name || !description || !price || !category || !stock)//or we can check this in route as done in user
        return res.status(400).json({
            error: "Please include all fields"
        });

    let product = new Product(fields)//product created on the basis of fields which is given by user

    //handle file here
    if(file.photo){//use any name for photo variable and then use same while giving input
        if(file.photo.size > 3000000)//size > 2mb (2*1024*1024)
            return res.status(400).json({
                error: "File size too big"
            });
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contectType = file.photo.type;
    }
    //save to DB
    product.save((err, product) => {
        if(err)
            return res.status(400).json({
                error: "Saving product in DB failed"
            });
        res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;//made a middleware below to load this photo separately to increase efficiency
    res.json(req.product);
}

exports.photo = (req, res, next) => {//not made param route as it will be called from frontendTODO:
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contectType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
    if(err)
        return res.status(400).json({
            error: "Problem with image"
        });
    //updation code
    let product = req.product;
    product = _.extend(product, fields);//these fields are going to be updated into product. Also 2 other ways of updation are discussed earlier
    
    //handle file here
    if(file.photo){
        if(file.photo.size > 3000000)
            return res.status(400).json({
                error: "File size too big"
            });
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contectType = file.photo.type;
    }
    //save to DB
    product.save((err, product) => {
        if(err)
            return res.status(400).json({
                error: "Product updation failed"
            });
        res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, product) => {
        if(err)
            return res.status(400).json({
                error: "Failed to delete this product"
            });
        res.json({
            product,
            message: "Successfully deleted"
        });
    });
};

exports.getAllProducts = (req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;//if there is a query from frontend which has limit property then execute this
    //used parseInt as the input is always string
    Product.find()
    .select("-photo")//dash means don't want to select, written without dash means select
    .populate("category")
    .sort([[sortBy, "descending"]])
    .limit(limit)
    .exec((err, products) => {
        if(err)
            return res.status(400).json({
                error: "No product found"
            });
        res.json(products);
    });
};

exports.getAllUniqueCategories = (_req, res) => {//can get only category id using this method
    Product.distinct("category", {}, (err, category) => {//field from product model, options, callback
      if(err) {
        return res.status(400).json({
          error: "No category found"
        });
      }
      res.json(category);
    });
  };

exports.updateInventory = (req, res, next) => {//TODO: will be explained later
    let myOperations = req.body.order.products.map(prod => {
        return{
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}//.count is coming from frontend
            }
        };
    });
    Product.bulkWrite(myOperations, {}, (err, _result) => {//oparation, options, callback
        if(err)
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        next();
    });
};
