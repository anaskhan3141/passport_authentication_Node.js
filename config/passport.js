const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load User Model

const User = require('../models/User');



module.exports = function(passport){
    passport.use(new localStrategy({usernameField:'email'} , (email,password,done)=>{
        //match user
        User.findOne({ email:email })
        .then(user =>{
            if(!user){
                return done(null, false,{message:'email is not registered'});
            }

            //match password 
            bcrypt.compare(password , user.password , (err,isMatch)=>{
                if(err) throw err;

                if(isMatch){
                    return done (null, user);
                }else{
                    return done(null, false,{message:'password incorrect'})
                }
            })
        })
        .catch(err => console.log(err));
    }))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });  
}

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));