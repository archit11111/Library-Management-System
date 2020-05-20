const mongoose = require('mongoose');

//This collection will be permanent(unlike borrow_request.js) and store
//all the history of borrow requests till now
const recordHistorySchema = new mongoose.Schema({
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
        type : String,
        required : true
    },
    borrow_date : {
        type : Date
    },
    due_date : {
        type : Date
    },
    return_date : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("RecordHistory" , recordHistorySchema);  