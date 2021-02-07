/* This file is used to define the structure of the database */

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Here we are telling the mongoose to use this type
    name: { type: String, required: true},
    price: { type: Number, required: true},
    productImage: { type: String, required: true}
    
    // _id: mongoose.Schema.Types.ObjectId, // Here we are telling the mongoose to use this type
    // name: String,
    // price: Number
});
/* Here we are passing a javascript object which defines how my product should look like */ 

module.exports = mongoose.model('Product', productSchema);

/* Model is used to give you a constructor to build us object 
based on that schema */