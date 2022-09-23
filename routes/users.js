const express = require('express');
const router = express.Router();
const bcrypt = require ('bcryptjs');
const passport = require('passport'); 

const User = require('../models/User')

//LOGIN PAGE 
router.get('/login',(req,res)=> res.render('login'))

//REGISTER PAGE 
router.get('/register',(req,res)=> res.render('register'))


//HANDLE REGISTER
router.post('/register',(req,res)=>{
    const {name, email, password, password2 } = req.body;
    
    
    const errors=[];

    //checking required fields
    if (!name ||!email ||!password ||!password2){
        errors.push({ msg:'please fill all fields'})
        
    }

    //checking for matching passwords
    if (password !=password2){
        errors.push({msg: 'passwords do not match '})

    }
    //check pass length
    if (password.length < 6){
        errors.push({msg:'password should be atleast 6 characters'})
    }
    if (errors.length >0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        //VALIDATION PASSED 
        User.findOne({email:email})
        .then(user=>{
            if (user){
                //user found 
                errors.push({ msg: 'Email is already registered'})
                res.render('register',{errors,name,email,password,password2})
                

            }else{
                const newUser = new User({
                    name:name,
                    email:email,
                    password:password
                });
                //HASH PASSWORD 
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err, hash)=>{
                        if (err){
                            console.log(err);
                        }else{
                            newUser.password = hash;
                            newUser.save()
                            .then(user=>{
                                req.flash('success_msg','you are now registered')
                                res.redirect('/users/login')
                            })
                            .catch(err=>console.log(err))
                        }
                    })
                })
                
            }

        })
    }
});


router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash : true
})(req,res,next);
})


//logout handel 
router.get('/logout',(req,res)=>{
    req.logout(err=>{
        if(err){
            throw err;
        }
    });
    req.flash('success_msg', 'you are now logged out')
    res.redirect('/users/login')
})
module.exports =router;