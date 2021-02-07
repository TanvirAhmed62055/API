//  In this file we are making product related routes

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const multer = require('multer');

const checkAuth = require('../middleware/check-auth'); // Importing the middleware (check-auth)


const storage = multer.diskStorage({ // This line is for storage strategy
    destination: function(req, file, cb){
        cb(null, './uploads/'); // The null is for potential error we want to write one. we can write it but we wont do it here so will keep it as null
        // Here we are also saying that. Here is the destination file. 
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString + file.originalname); 
        /* Here in the second parameter we are what is the file name should be while storing it.
        So, Here the filename is set at the 'date + ISOname in Strings + orginal file name' */
    }
});


const fileFilter = (req, file, cb) => {  // At this function we are sitting up a filter for the images to store
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true); // This line will store the file. If the condition is true.
    } else {
        var message = "This file does not meet our criteria. Please upload jpeg or png files under 5MB"
        cb(new Error(message), false); 
        /* This file will ignore uploading the file if it is not true.
        But we will put the error message in the first parameter */
    }
};


const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}); 


// This folder is not publically accessable by people but changed to global or satic folder later on 'app.js' to access  
/* In the line above we can change the configaration up here. when we initailiza multer.
We can be  more detailed here and define how we want to store that file.
We can also make sure that we only store certian types of file.*/

const Product = require('../models/products');
// const router = express.Router(); 
/* express route is like a sub package from express framework which ships with that and gives us 
different capabilites which conviniently handles different roughts, endpoints with different HTTP words*/

router.get('/', (req, res, next) => { // Here we are hendaling the GET request
    Product.find()
    .select('_id name price productImage') // Here we are saying what are the data we need to fetch
    .exec() // It is for promice thing
    .then(docs => {
        const response ={
            NoOfData: docs.length, // This property is used for counting the amount of data ( How many datas are there ?)
            product: docs.map(doc => {      // This will print the array of all the products
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            }) 
        }
        // console.log(docs);
        if(docs.length >= 0){
            res.status(200).json(response); // This is used for printing the data
        } else {
            res.status(404).json({
                message: 'No Entries Found'
            });
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
    /*res.status(200).json({
        message: 'Handling GET request to /products'
    });*/
});

router.post('/',checkAuth ,upload.single('productImage') ,(req, res, next) => { // Here we are hendaling the POST request
    
    /*const product = {
        name: req.body.name, // Here We are asking for name data or anything other data we can ask for it. 
        price: req.body.price,
        // testing: req.body.testing // This line is just i am testing my theory
    };*/

    console.log(req.file); // This print out all the detail in the terminal when the picture is uploaded
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    }); // Here we are saying how our data will be submitted and and what are we requesting for

    product
        .save()
        .then(result =>{ // when you get the result then print the result
        console.log(result);
        res.status(201).json({
            message: 'Created Product Successfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
    /* Here we are saving and then also telling them to print the result in 
    console and catch the error and print it in console*/ 
});

/* >>>>>    Here are making for an individual products     <<<<<<*/
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId; // Here we are extacting the product ID

    Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc => { 
        console.log("From Database", doc);
        if (doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost3000/products/' + doc._id
                }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for the provider'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })

    // if (id === 'special'){
    //     res.status(200).json({
    //         message: 'You are the chosen one !!!',
    //         id: id
    //     });
    // } else {
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     });
    // }
});


router.patch('/:productId',checkAuth , (req, res, next) => { // This is for Patch Request
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    /* This for loop will iterrate through every variable and in javascript in which you have described
    and the change value in the variable.
    EXAMPLE: 
    [
        {
            "propName": "name", "value": "Tanvir Ahmed"
        }
    ]

    Then it will change the value in the variable.
    */ 

    Product.update({ _id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        // console.log(result);
        res.status(200).json({
            message: 'Product Has Been Updated',
            request: {
                type: 'GET',
                url: 'http://localhost3000/products/' + id
            }
        });
    })
    .catch(err =>{
        console.log(err); // Print what is the error in the terminal
        res.status(500).json({
            error: err
        });
    });
    /* If we wanted we could do this.
    Product.update({_id: id}, {$set: {name: req.body.newName, price: req.body.newPrice}});
    but then the software would assume the everytime we want to change something we need to change both.
    but we dont want that so we need to change that */ 
    
    /*res.status(200).json({
        message: 'Updated Products !'
    });*/
});

router.delete('/:productId', checkAuth , (req, res, next) => { // This is for Delete Request
    const id = req.params.productId; // Here we are requesting for the ID from the URL
    Product.remove({_id: id}) // Here we are saying that i am going to delete the data which has this ID    
    .exec()
    .then(res => {
        res.status(200).json({
            message: 'Product has been deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/' + id,
                bodyStructure: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });


    /*res.status(200).json({
        message: 'Deleted Products !'
    });*/
});


module.exports = router; // so that the router that we configured is exported and can be used in the app.js file.