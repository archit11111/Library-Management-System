const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        lowercase : true 
    },
    //admin will login by user_name
    userName : {
        type : String,
        unique : true,
        required : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    //other info ??
});

module.exports = mongoose.model("Admin",adminSchema);