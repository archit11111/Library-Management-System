const mongoose = require('mongoose');


//This collection will store the current pending borrow request of 
//all users who have put borrow request
const borrowSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    book_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book",
        required : true
    },
    copy_id : {
        type : String,//mongoose.Schema.Types.ObjectId,
        //ref : "Book",
        required : true
    },
    //borrow date automatically set to time of initiation of borrow request
    /*borrow_date : {
        type : Date,
        default : Date.now,
        //expires : 60
    },*/
    due_date : {
        type : Date,
        default : new Date(+new Date()+7*24*60*60*1000)//Date.now + 7*24*60*60*1000 // 7 days from borrow
    },
},{timestamps:true});
//borrowSchema.index({"createdAt" : 1},{expireAfterSeconds : 60});

module.exports = mongoose.model("BorrowRequest",borrowSchema);