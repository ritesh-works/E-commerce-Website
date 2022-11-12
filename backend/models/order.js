const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productCartSchema = new mongoose.Schema({ //or create another file
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
})

const orderSchema = new mongoose.Schema({
    products: [productCartSchema],
    transactionId: {},
    amount: Number,
    address: String,
    status: {
        type: String,
        default: "Received",
        enum: ["Cancelled", "Delivered", "Shipped", "Precessing", "Received"]
    },
    updated: Date,
    user:{
        type: ObjectId,
        ref: "User"
    }
 },
 { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
module.exports = mongoose.model("ProductCart", productCartSchema);
