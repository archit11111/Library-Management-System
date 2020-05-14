const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name            : {
        fname : {type : String , required : true,lowercase : true},
        mname : {type : String , required : true,lowercase : true},
        lname : {type : String , required : true,lowercase : true}
    },
    //user will login by userName
    userName : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    },
    /*contact : {
        type : Number,
        required : true //??
    },*/
    password : {
        type : String,
        required : true
    },
 
    borrow_status   : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : "BorrowLog" 
    }]
});

/*userSchema.path('borrow_status').validate(function (curr) {
    if(curr.length == 2)
        return false;
});*/

module.exports = mongoose.model('User', userSchema);



/*const userSchema = new mongoose.Schema({
    name            : {
        fname : {type : String , required : true,lowercase : true},
        mname : {type : String , required : true,lowercase : true},
        lname : {type : String , required : true,lowercase : true}
    },
    //user will login by userName
    userName : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    },
 //   contact : {
 //       type : Number,
 //       required : true //??
 //   },
    password : {
        type : String,
        required : true
    },
    //currently only one book can be borrowed at a time 
    borrow_status   : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : "BorrowLog" 
    }]
});*/