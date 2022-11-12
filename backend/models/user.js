const mongoose = require("mongoose");
const crypto = require("crypto");
const {v4:uuidv4} = require("uuid");

//can also store mongoose.Schema in a variable
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    userinfo: {
        type: String,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
  },
  { timestamps: true }
);

userSchema.virtual("password")//"password" is the virtual property, this is something which we are passing
        .set(function(password){//can't use call back function here
            this._password = password;
            this.salt = uuidv4(); //salt field is set using uuid in virtual property
            this.encry_password = this.securePassword(this._password);//or simply password
        })
        .get(function(){
            return this._password;
        })

userSchema.methods = {
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac("sha256",this.salt).update(plainpassword).digest("hex");
            //format of crypto.createHmac is ('algorithm', random string)
        }
        catch(err){
            return "";
        }
    },
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
        //returns true or false
    }
};

module.exports = mongoose.model("User", userSchema); //any name could be given in place of User