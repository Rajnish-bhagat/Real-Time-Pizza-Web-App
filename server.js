const express= require('express') // import express module

const app = express() // now app contains all the functionalities which express offers
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts') //In an Express.js application, expressLayouts is a middleware that enables layout support in your views or templates.
const PORT = process.env.PORT || 3000 // might be set externally as an environment variable, often by the hosting environment or system where the Node.js application is deployed

app.use(express.static('public'))


app.get('/',(req,res)=>{
    res.render('home')
})

// set template engine

app.use(expressLayout)

app.set('views',path.join(__dirname,'/resources/views')) // we have to tell express where oue views/ template files are
app.set('view engine', 'ejs') // specified view engine (e.g., EJS, Pug, Handlebars, etc.) configured through app.set('view engine', 'engineName').


app.listen(PORT, ()=>{   // server starts at port 3000
    console.log(`Listening on port ${PORT}`) // Note that backtick `${PORT}` must be used instead of '${PORT}' to print the variable
})