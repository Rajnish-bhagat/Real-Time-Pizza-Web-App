const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController(){
    const _getRedirectUrl=(req)=>{
        return req.user.role === 'admin' ?  '/admin/orders' : '/customers/orders'

    }
    return {
        login(req,res){
            res.render('auth/login')
        },
        postLogin(req,res,next){
            const {email, password} = req.body
            
            // validate request
            if(!email || !password)
            {
                req.flash('error', 'All fields are required!')
                return res.redirect('/login')
            }
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }

                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req,res,next)
        },
        register(req,res){
            res.render('auth/register')
        },
        async postRegister(req,res){
            const {name, email, password} = req.body
            
            // validate request
            if(!name || !email || !password)
            {
                req.flash('error', 'All fields are required!')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            // check if email exists in the database ( ig it is depreciated now )

            // User.findOne({email: email}, (err, result)=>{
            //     if(result){
            //         req.flash('error', 'Email already in use!')
            //         req.flash('name', name)
            //         req.flash('email', email)
            //         return res.redirect('/register') 
            //     }
            // })

            const useremail = await User.findOne({ email: email });

            if (useremail) {
                // Email already exists
                req.flash('error', 'Email already in use!');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }

            // Hash password

            const hashedPassword = await bcrypt.hash(password, 10)

            // create a user

            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })

            user.save().then((user)=>{ 
                //Login

                return res.redirect('/')

            }).catch(err=>{
                req.flash('error', 'Something went wrong!')
                return res.redirect('/register')
            })

        },
        logout(req, res) { // updated. earlier one got depreciated
            req.logout(function(err) {
              if (err) {
                console.error(err);
                return res.status(500).send('Error logging out');
              }
              res.redirect('/login'); 
            });
        }
    }

}

module.exports= authController












// During the login process
// passport.authenticate('local', (err, user) => {
//     if (err) {
//       // Handle error
//     }
//     if (!user) {
//       // Handle invalid credentials
//     }
  
//     // Manually log in the user
//     req.logIn(user, (err) => {
//       if (err) {
//         // Handle error
//       }
  
//       // Retrieve the user's cart data from the database
//       Cart.findOne({ userId: user._id }, (err, cart) => {
//         if (err) {
//           // Handle error
//         }
  
//         // Update the session with the retrieved cart data
//         req.session.cart = cart; // or merge with existing cart data in req.session
//         // Redirect the user to a dashboard or a desired page
//         res.redirect('/dashboard');
//       });
//     });
//   })(req, res, next);

