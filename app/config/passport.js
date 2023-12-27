const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt') 

function init(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done)=>{
        //Login

        // check if user exists
        const user = await User.findOne({email: email})

        if(!user)
        {
            return done(null, false, {message: 'No user with this email'})
        }

        bcrypt.compare(password, user.password).then(match=>{
            if(match){
                return done(null, user, {message: 'Logged in successfully'})
            }
            return done(null, false, {message: 'Incorrect username or password'})
        }).catch(err=>{
            return done(null, false, {message: 'Something went wrong'})
        })

    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    // This got depreciated
    // passport.deserializeUser((id, done)=>{
    //     User.findByID(id, (err, user)=>{
    //         done(err, user)
    //     })
    // })
    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
          done(null, user);
        }).catch(err => {
          done(err, null);
        });
      });

}

module.exports = init