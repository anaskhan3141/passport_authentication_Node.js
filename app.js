const express = require('express');
const expresslayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash =require('connect-flash');
const session =  require('express-session');
const passport = require('passport');


const app = express();

//PASSPORT CONFIG
require('./config/passport')(passport);

// DB CONNECT 
const db = require('./config/keys').MongoURI;

//CONNECT TO MONGO
mongoose.connect(db, {useNewURLParser: true})
.then(()=>console.log('mongo db connected..'))
.catch(err=> console.log(err)); 

//EJS
app.use(expresslayout);
app.set('view engine', 'ejs');

//BODYPARSER
app.use(express.urlencoded({extended: false}));


// EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))
//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());
//CONNECT FLASH
app.use(flash());

//global variable 
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

})
//ROUTES 
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


const PORT =process.env.PORT || 5000;

app.listen(PORT, console.log(`server started at ${PORT}`))