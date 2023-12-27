const order = require('../../../models/order')

function orderController(){
    return{
        index(req,res){
            // depreciated
            // order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
            //     if(req.xhr) {
            //         return res.json(orders)
            //     } else {
            //      return res.render('admin/orders')
            //     }
            // })

            order.find({ status: { $ne: 'completed' } })
            .sort({ 'createdAt': -1 })
            .populate('customerId', '-password')
            .then(orders => {
                if (req.xhr) {
                    return res.json(orders);
                } else {
                    return res.render('admin/orders', { orders });
                }
            })
            .catch(err => {
                console.error(err);
            });
        }
    }
}

module.exports = orderController

