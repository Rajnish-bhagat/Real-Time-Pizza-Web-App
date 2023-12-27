const Menu = require('../../models/menu.js')
 
function homeController(){
    return {
        async index(req,res){
 
            // Menu.find().then(function(pizzas){               // The identifier pizzas is the parameter of the callback function passed to the .then() method. When you call .then() on a Promise
            //     console.log(pizzas)                          // (in this case, the result of Menu.find()), it expects a callback function. This function receives the resolved value of the
            //     res.render('home', {pizzas : pizzas})        // Promise as an argument. In this context, the resolved value is the array of pizzas retrieved from the MongoDB 'Menu' collection.
            // })

            // Alternative of above code but only works when func is async:

            const pizzas = await Menu.find()
            // console.log(pizzas) 
            return res.render('home', {pizzas: pizzas})
        }
    }
}

module.exports= homeController