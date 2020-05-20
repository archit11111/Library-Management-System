const mongoose = require('mongoose');

//This collection will be permanent(unlike borrow_request.js) and store
//all the history of borrow requests till now
const borrowLogSchema = new mongoose.Schema({
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
        default : Date.now
    },*/
    due_date : {
        type : Date,
        default : new Date(+new Date()+7*24*60*60*1000) // 7 days from borrow
    },
},{timestamps:true});

module.exports = mongoose.model("BorrowLog" , borrowLogSchema);  