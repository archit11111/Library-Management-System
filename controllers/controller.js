const   express         = require('express'),
        mongoose        = require('mongoose'),
        nodemailer      = require('nodemailer'),
        formidable      = require('formidable'),
        fs              = require('fs'),
        path            = require('path'),
        session         = require('express-session'),
        Admin           = require('../models/admin'),
        User            = require('../models/user'),
        BorrowRequest   = require('../models/borrow_request'),
        BorrowLog       = require('../models/borrow_log'),
        RecordHistory   = require('../models/records_history'),        
        Book            = require('../models/book.js');

//This function will delete a borrow_request if its timer has expired and restore the book as available
function borrow_check(){
    BorrowRequest.find({},(err,reqs)=>{
        const current_time=new Date();
        for(let i=0;i<reqs.length;i++){
            let d=new Date(reqs[i].createdAt);
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

//This function will send notification once the return deadline is near
function notifications(){
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth :{
            // Set email and password here 
            user : '',
            pass :  ''
        } 
    });
    BorrowLog.find({},(err,logs)=>{
        const current_time=new Date();
        for(let i=0;i<logs.length;i++){
            let d=new Date(logs[i].createdAt);
            if(((current_time-d)/86400000)>0){ 
                const mailOptions = {
                    from : 'abcx64456@gmail.com',
                    to : 'bhagatea@gmail.com',
                    subject : 'Book Return notification',
                    text : 'Return book :[ '
                };
                transporter.sendMail(mailOptions,(err,info)=>{
                    if(err)
                        console.log(err);
                    else
                        console.log('Email sent : '+info.response);
                });
            } 
        }      
    });
}
setInterval(notifications,1000000);

function uploadhandler(req,res){
        const form = new formidable.IncomingForm({uploadDir:path.join(__dirname,'../uploads/')},{keepExtensions:true});
        let id,file_path = form.uploadDir;
        form.parse(req,(err,fields,files)=>{            
            id = fields.id;
        });
        form.on('fileBegin',(name,file)=>{
            file_path += file.name;
            file.path = file_path;       
        });

        form.on('end',()=>{
            console.log('5.'+id);
            console.log('6.'+file_path);
            Book.updateOne({_id:id},{img_path:file_path},{multi:true},(err,book)=>{console.log(book);});
        })
        res.render('update_book',{upload:1});
}

//User login authentication
function user_login_Authentication(req,res){
    User.findOne({userName : req.body.username,password : req.body.password},(err,found)=>{
        if(err){
            res.end(err);
        }
        else if(found==null){
            res.render('login',{err:1});
        }
        else{
            let sess = req.session;
            sess.name = req.body.username;
            sess.password = req.body.password;
            console.log(req.session);
            //alert('Login Succesful !');
            res.redirect('/index');            
        }
    });
}

//Admin login authentication
function admin_login_authentication(req,res){
    Admin.findOne({userName : req.body.username,password : req.body.password},(err,found)=>{
        console.log(req.body);
        if(err){
            res.end(err);
        }
        else if(found==null){
            res.render('adminlogin',{err:1});
        }
        else{
            let sess = req.session;
            sess.name = req.body.username;
            sess.password = req.body.password;
            sess.admin=1;
            console.log(req.session);
            //alert('Login Succesful !');
            res.redirect('/index');            
        }
        
    });
}

//New User Registeration
function user_registeration(req,res){
    const new_user = new User({
        name : {
            fname : req.body.firstName,
            mname : req.body.middleName,
            lname : req.body.lastName
        },
        userName : req.body.username,
        password : req.body.password
    });
    console.log(new_user)
    new_user.save((err)=>{
        if(err)
            res.end(err);
        res.redirect('/login');
    });
}

//Displays all the available books on the main index page
function display_books(req,res){

    Book.find({},(err,books)=>{
        if(err)
            console.log(err);
        else{
            res.render('index',{books : books});
        }
    });
}

//Displays the books according to User Search
function search_books(req,res){
    //console.log(req.body);
    let bookName,Author,Tag,Description;
    let regex = new RegExp(req.body.Search,'i');    
    bookName=(req.body.BookName==null?"=-)(*&":regex);
    Author=(req.body.Author==null?"=-)(*&":regex);
    Tag=(req.body.Tag==null?"=-)(*&":regex);
    Description=(req.body.Description==null?"=-)(*&":regex);

    Book.find({$or:[{author:Author},{tags:Tag},{name:bookName},{description:Description}]},(req2,books)=>{
        //console.log(books);
        if(books==undefined)books=[];
        res.render('index',{books:books});
        res.end();
    });
}

module.exports = {  borrow_check,
                    uploadhandler,
                    user_login_Authentication,
                    admin_login_authentication,
                    user_registeration,
                    display_books,
                    search_books
                };