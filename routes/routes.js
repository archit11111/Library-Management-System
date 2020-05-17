const   express = require('express'),
        mongoose = require('mongoose'),
        session = require('express-session'),
        router  = express.Router(),
        Admin  = require('../models/admin'),
        User    = require('../models/user'),
        BorrowRequest = require('../models/borrow_request'),
        BorrowLog = require('../models/borrow_log'),
        Book    = require('../models/book.js');

router.get("/",(req,res)=>{
    res.render("landing.ejs");
});

router.use('/login',(req,res)=>{
    res.render('login.ejs');
});

router.use('/adminlogin',(req,res)=>{
    res.render('adminlogin.ejs');
});

router.use('/register',(req,res)=>{
    res.render('register.ejs');
});


router.use(session({
    secret : 'secretLOL',
    resave : true,
    saveUninitialized : false
}));

router.post('/userLoginAction',(req,res)=>{
    User.findOne({userName : req.body.username,password : req.body.password},(err,found)=>{
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
            console.log(req.session);
            //alert('Login Succesful !');
            res.redirect('/index');            
        }
    });
});

router.post('/adminLoginAction',(req,res)=>{
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
});

router.post('/registerAction',(req,res)=>{
    const new_user = new User({
        name : {
            fname : req.body.firstName,
            mname : req.body.middleName,
            lname : req.body.lastName
        },
        userName : req.body.username,
        password : req.body.password
    });
    new_user.save((err)=>{
        if(err)
            res.end(err);
        //alert('Registeration successful !');
        res.redirect('/login');
    });
});

router.post('/searchAction',(req,res)=>{
    console.log(req.body);
    let bookName,Author,Tag,Description;
    let regex = new RegExp(req.body.Search,'i');    
    bookName=(req.body.BookName==null?"=-)(*&":regex);
    Author=(req.body.Author==null?"=-)(*&":regex);
    Tag=(req.body.Tag==null?"=-)(*&":regex);
    Description=(req.body.Description==null?"=-)(*&":regex);
    console.log(bookName+"\n"+Author+"\n"+Tag);

    Book.find({$or:[{author:Author},{tags:Tag},{name:bookName},{description:Description}]},(req2,books)=>{
        console.log(books);
        if(books==undefined)books=[];
        res.render('index',{books:books});
        res.end();
    });
});

router.use("/borrow/:id",(req,res,next)=>{
    const userName = req.session.name;
    const password = req.session.password;
    User.findOne({userName : userName,password : password },(err,found)=>{
        if(err){
            console.log("error "+err);
            res.end(err);
        }else if(found==null){
            console.log('redirected');
            res.redirect('/login');
        }else{
            //console.log(req.params+"\nworking");
            next();
        }
    }
    );

});

router.use("/index",(req,res)=>{
    Book.find({},(err,books)=>{
        if(err)
            console.log("couldn't"+err);
        else{
            res.statusCode = 404;
           // res.setHeader('Content-Type', 'text/plain');
           // res.write("Here : \n");
            res.render('index',{books : books});
        }
    });
});

router.use("/admin",(req,res,next)=>{
    console.log(req.session);
    if(!(req.session!=undefined && req.session.admin==1)){
        res.send("Error! Make sure you are logged in.");
    }
    else{
        next();
    }
});

router.get("/admin",(req,res)=>{
    res.render('admin');
})

router.get('/admin/create',(req,res)=>{
    res.render('create_book.ejs');
});

router.post('/admin/deleteBookSearchAction',(req,res)=>{
    let bookName,Author,Tag,Description;
    let regex = new RegExp(req.body.Search,'i');    
    bookName=(req.body.BookName==null?"=-)(*&":regex);
    Author=(req.body.Author==null?"=-)(*&":regex);
    Tag=(req.body.Tag==null?"=-)(*&":regex);
    Description=(req.body.Description==null?"=-)(*&":regex);
    Book.find({$or:[{author:Author},{tags:Tag},{name:bookName},{description:Description}]},(req2,books)=>{
        if(books==undefined)books=[];
        res.render('delete_book',{books:books});
        res.end();
    });
});

router.get('/admin/delete',(req,res)=>{
    res.render('delete_book.ejs');
});

router.post('/admin/addBookAction',(req,res)=>{
    //res.send(req.body);
    console.log(req.body);
    const tags = req.body.tags.split(','),
          author = req.body.author.split(','),
          copies = req.body.copies.split(','),
          name = req.body.bookName,
          book_ISBN = req.body.isbn,
          description = req.body.description,          
          index = copies.length;
    const new_book = new Book({
        name : name,
        description : description,
        book_ISBN : book_ISBN,
        author : author,
        tags : tags,
        copies : copies,
        index : index
    });
    new_book.save((err)=>{
        if(err)
            res.send(err);
        else
            res.render('create_book',{add:1});
    })
            

    console.log(tags);

});

router.post('/admin/deleteBookAction',(req,res)=>{
    console.log(req.body);
    Book.deleteOne({_id:req.body.id},(req)=>{
        console.log('deleted');
        res.render('delete_book.ejs',{del:1});
    });
   // res.end();
});

router.get("/borrow/:id",(req,res)=>{
    let id = (req.params.id);
    Book.findOne({'_id' : mongoose.Types.ObjectId(id) },(err,book)=>{
        if(err){
            console.log("error "+err);
        }         
    })
    .populate('comments.user_id')
    .exec((err,book)=>{
        if(!err)
            res.render('borrow.ejs',{book : book, comment : book.comments });
        else 
            console.log(err);
    });
});




router.get("/borrow/:id/confirm",(req,res)=>{
    let id = (req.params.id);
    Book.findOne({'_id' : mongoose.Types.ObjectId(id) },(err,book)=>{
        if(err){
            console.log("error "+err);
        }         
    })
    .populate('comments.user_id')
    .exec((err,book)=>{
        if(err)
            res.end("Something went wrong!");
        else{
            const username=req.session.name;
            User.findOne({userName:username},(err,user)=>{
                if(user.borrow_status.length>=2)
                    res.send("borrow limit exceeded");
                else if(book.copies.length===0){
                    res.send('Sorry, currently no books are available!');
                }
                else{
                    const new_borrow_request=new BorrowRequest({
                        user_id : user._id,
                        book_id : book._id,
                        copy_id : book.copies[book.copies.length-1]
                    });
                    new_borrow_request.save((err,borrow_obj)=>{
                        if(err)
                            res.send(err);
                        else {
                            User.findOneAndUpdate({_id:user._id},{$push:{borrow_status:borrow_obj._id}},err=>{if(err)console.log(err)});
                            console.log(user);
                            Book.updateOne({_id:book._id},{$pull:{copies:book.copies[book.copies.length-1]}},err=>{if(err)console.log(err);});
                            res.send('saved!');
                        }
                    });
                }
            });
            
        }
    });    
    //res.send("Your book has been confirmed");
});




module.exports = router;