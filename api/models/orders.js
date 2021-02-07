/* Here we are connecting the product with orders and setting up the structure*/

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    product: { type: mongoose.Schema.Types.ObjectId , ref: 'Product', required: true },// ref is used to configure the type.
    quantity: { type: Number, default: 1 } // In this section we are setting a default number 1 if there was no number was passed.   
});


module.exports = mongoose.model('Order', orderSchema);
