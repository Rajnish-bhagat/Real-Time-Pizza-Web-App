require('dotenv').config()  // Note that any secret key, api keys, passwords should be stored in a different env file. These get stored in the node process outside our application. Our application has access to this and we can 'get' the same. We install a package dotenv for this.
                            // After this line, we ccan access all variables of .env file here

const express= require('express') // import express module
const app = express() // now app contains all the functionalities which express offers
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts') //In an Express.js application, expressLayouts is a middleware that enables layout support in your views or templates.
const PORT = process.env.PORT || 3000 // might be set externally as an environment variable, often by the hosting environment or system where the Node.js application is deployed
const mongoose = require('mongoose') // req to interact with mongoDB database.
const session = require('express-session') // for storing cart we use session and we require this for that task.
const flash = require('express-flash') // express-flash is a middleware for the Express.js framework that allows flash messages to be sent and displayed to the user. 
const MongoDbStore = require('connect-mongo') //(note the capital MongoDbStore (constructor or class)) for storing cookies in the database else bydefault they'll be stored in main memory
const passport = require('passport') // for login system
const Emitter = require('events') // Event emitter

// Database Connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, {});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database connected...');
});

connection.on('error', (err) => {
    console.error('Connection error:', err.message);
});


// Session store (Below code didn't work due to syntax depreciation with this we had to add pass (session) to require('connect-mongo'))

// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

// Session store 

let mongoStore = MongoDbStore.create({
    mongoUrl: url,
    collection: "sessions",
    // autoRemove: 'interval',     
    // autoRemoveInterval: 1 // In minutes. Default
})
 

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter) // can access anywhere in our app since it is binded now

// Session config 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000*24*60*60 } // 24 hour  
}))

// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())  // for flash messages

// Assets
app.use(express.static('public')) // This line enables your Express server to serve static files (like images, CSS, JavaScript files, etc.) located in the public directory.
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set template engine

app.use(expressLayout)

app.set('views',path.join(__dirname,'/resources/views')) // we have to tell express where our views/ template files are
app.set('view engine', 'ejs') // specified view engine (e.g., EJS, Pug, Handlebars, etc.) configured through app.set('view engine', 'engineName').

require('./routes/web')(app)

const server = app.listen(PORT, ()=>{   // server starts at port 3000
    console.log(`Listening on port ${PORT}`) // Note that backtick `${PORT}` must be used instead of '${PORT}' to print the variable
})

// different routes Note: They should be below the template engine for them to work as intended.


// Socket 

const io = require('socket.io')(server) // socket connection for realtime updates

io.on('connection',(socket)=>{
    console.log(socket.id)
    socket.on('join',(orderId)=>{
        console.log(orderId)
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated', data)

})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)

})