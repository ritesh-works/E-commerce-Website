require("dotenv").config(); //load .env file and use all variables present in it
const mongoose = require("mongoose");
const express = require("express");//express is default export so no curly braces
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();//can be any variable not necessarily file name

//My routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

//PORT
const port = process.env.PORT || 8000;

//DB Connection
mongoose.connect(process.env.DATABASE, { //process attach all the new dependencies
    //to cope up with the deprecations in the MongoDB Node.js driver, below options are used.
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => (console.log("DB CONNECTED"))).catch(() => console.log("DB NOT CONNECTED"));

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());//is used to put token in cookie
app.use(cors());

//My Routes
app.use('/api', authRoutes);//now 'api' needs to be added before all routes in auth file
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);


app.get("/", (req, res)=>{
    return res.send("Home");
    });


//Starting a server
app.listen(port,()=>(
    console.log(`App is running at ${port}`)
    ));
