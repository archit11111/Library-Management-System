const mongoose    = require("mongoose"),
    Book        = require("./models/book"),
    User        = require('./models/user');

let books = [
    {
        name        : "Operating System and You 1",
        description : "A book on operating sysem",
        book_ISBN        : "123456778",
        tags        : ["CSE" , "IT" , "OS" ],
        author      : ["William Stalling" ,"Linus Torwald"],
        copies      : ["3312" , "3313" , "3314" , "3315"],
        index       : 4,
        comments    : [
            {
                user_id : "5eb3ff4450cde9276411898e",
                like     : true,
                comment    : User._id
            },
            {
                user_id : "5eb3ff4450cde9276411898e",
                like     : true,
                comment    : User._id
            }
        ]
    },
    {
        name        : "Operating System and You 2",
        description : "A book on operating sysem",
        book_ISBN   : "123456779",
        tags        : ["IT" , "OS" ],
        author      : ["William Stalling" ,"Linus Torwald"],
        copies      : ["3312" , "3313" , "3314" , "3315"],
        index       : 4,
        index       : 4,
        comments    : [
            {
                user_id : "5eb3ff4450cde9276411898e",
                like     : true,
                comment    : "Great Book..!"
            },
            {
                user_id :"5eb3ff4450cde9276411898e",
                like     : true,
                comment    : "I don't like it"
            }
        ]
    },
    {
        name        : "Operating System and You 3",
        description : "A book on operating sysem",
        book_ISBN        : "123456770",
        tags        : ["CSE" , "IT" , "OS" ],
        author      : ["William Stalling" ,"Linus Torwald"],
        copies      : ["3312" , "3313" , "3314" , "3315"],
        index       : 4,
        index       : 4,
        comments    : [
            {
                user_id : "5eb3ff4450cde9276411898e",
                like     : true,
                comment    : "Great Book..!"
            },
            {
                user_id : "5eb3ff4450cde9276411898e",
                like     : true,
                comment    : "I don't like it"
            }
        ]
    }
] ;

Book.find({}).populate('comments.user_id').exec((err,res)=>{console.log(res);});

function seedData(){
   Book.remove({} , function(err) {
       if(err){
           console.log("Couldn't clear database");
       }else{
           console.log("DataBase cleared");
            books.forEach(function(seed){
                Book.create(seed , function(err, addedBook){
                    if(err){
                        console.log("Error in seeding :" + err);
                    }else{
                        console.log("A book added");
                    }
                });
            });
       }
   });
}

module.exports = seedData;