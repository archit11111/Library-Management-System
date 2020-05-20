const   express = require('express'),
        mongoose = require('mongoose'),
        session = require('express-session'),
        Admin  = require('../models/admin'),
        User    = require('../models/user'),
        BorrowRequest = require('../models/borrow_request'),
        BorrowLog = require('../models/borrow_log'),
        Book    = require('../models/book.js');

function borrow_check(){
    BorrowRequest.find({},(err,reqs)=>{
        const current_time=new Date();
        for(let i=0;i<reqs.length;i++){
            let d=new Date(reqs[i].createdAt);
            //console.log((current_time-d)/60000);
            if(((current_time-d)/60000)>150){
                BorrowRequest.deleteOne({_id : reqs[i]._id},(err,br)=>{
                    if(err)
                        console.log(err.message);
                    else{ 
                        console.log('deleted'+br);
                        Book.updateOne({_id:reqs[i].book_id},{$push:{copies:reqs[i].copy_id}},err=>{if(err)console.log(err);});                        
                        User.updateOne({_id:reqs[i].user_id},{$pull:{borrow_status:reqs[i]._id}},(err,user)=>{console.log(user);});
                        
                    }
                });
            }
        }
    })
}
setInterval(borrow_check,10000);

module.exports={borrow_check};