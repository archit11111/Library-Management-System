const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        lowercase : true
    },
    description : String,
    book_ISBN : {
        type : String,
        required : true,
        unique : true
    },
    author : {
        type : [String],
        required : true
    },
    tags : {
        type : [String],
        required : true
    },
    copies      : [String],
    index       : Number,
    comments : [{
        user_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
           // required : true
        },
        like : {
            type : Boolean,
            default : false
        },        
        comment : {
            type : String,            
        }
    }]

}); 

// To keep number of tags greater than equal to 1 and length of inputted tag name is not 0
bookSchema.path('tags').validate(function(tags){
    if(!tags || tags.length === 0 || (tags.length === 1 && tags[0]==""))
        return false;
    else 
        return true;
});

// To keep number of authors greater than equal to 1 and inputted author length is not 0
bookSchema.path('author').validate(function(authors){
    if(!authors || authors.length === 0 || (authors.length === 1 && authors[0]==""))
        return false;
    else 
        return true;
});

module.exports = mongoose.model("Book" , bookSchema);  