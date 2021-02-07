/* This app.js file will be used to spin up the express application 
which will make handeling the request a bit easier for us

REMEMBER: The express file will be used to handle the requests

We are also initialising all the express app
*/

const express = require('express');
/* Here we are saying that the we need the package called express.
Just like import in JAVA*/

const app = express();
/* Here we will execute express like a function.
this will spin up the express application. where we can use all kinds of utility methods */

const morgan = require('morgan');
/*Here we are installing the morgan package where it will tell you the loggin detail*/  

const bodyParser = require('body-parser');
/* Here we are importing body-parser*/

const mongoose = require('mongoose');
/* Here we are importing mongoose */

const productRoutes = require('./api/routes/products'); //Here we are importing the products.js file
const orderRoutes = require('./api/routes/orders'); // Here we are importing the orders.js file
const userRoutes = require('./api/routes/user'); // Here we are importing the user.js file


mongoose.connect('mongodb+srv://API-test:' + process.env.MONGO_ATLAS_PW + '@cluster0.jorqt.mongodb.net/cluster0?retryWrites=true&w=majority', { useMongoClient: true }); // Here we are connecting to the Mongo Client and connecting the MongoDB Client
mongoose.Promise = global.Promise; // To Remove Waring ERROR
app.use(morgan('dev')); //Here we are saying that use morgan and the format is in 'dev'

app.use('/uploads', express.static('uploads'));
/* 
Here we are making the 'uploads' folder static or making it public and
For the first parameter we are telling that to parse only requests that are targeted to '/uploads/'
and then apply the middleware and later on will ignore the forst part 
*/

app.use(bodyParser.urlencoded({extended: false})); // Here we are parsing the URL encoded data

app.use(bodyParser.json()); //Here we are parsing json data


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    /* 
    Here We are saying that header is present an in the next parameter we can add a value 
    but as the "*" means to give access to any origin but we can also specify who give the access to
    ex:- res.header('Access-Control-Allow-Origin', 'http://my-cool-page.com') will only give acces to that specific website.
    */
    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    /* Here we are saying which kind of Header we want to accept 
    (So that all these headers can be appended to an incoming request) */

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE'); // Here we are saying that the those are the respone that we support when there is a 'OPTIONS' request
        return res.status(200).json({}); // Here we responds by status 200 and with empty json but due to the return statement we dont move forward. We STOP there. 
    }
    /* Here we are going to check if the incoming requested method 
    (method is also a property which gives as access to the HTTP method on the request 
        
    we are typing this if condition because the brower will always send OPTIONS request first.
    when you send a GET, POST or any other request.
    Here the browser sees if he can make the request or is he allowed to do so */

    next(); // It is used if we are not returing immidiately due to getting options request so that the other routes can take over.
});



app.use('/products', productRoutes);
app.use('/orders',orderRoutes);
app.use('/user', userRoutes);
/* In the first argument we are saying that. If in the URL there is a "/products" then request for the second argument.
In which the productRoutes directs to the product file */


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
/* The line above will handle all kind of request where it cannot find the route or find error*/

app.use((error, req, res, next) => {
    res.status(error.status || 500); // In this line it will give you either the 400 status code or the 500 status code.
    res.json({
        error:{
            message: error.message
        }
    });
});
/*The line above will handle all the error from anywhere in the application
example if you have large database and the operations fails then it will return the 500 error*/

module.exports = app;


/*

NOTE: This is the basic understanding of HOW THE APP.USE AND APP.GET.POST ETC WILL WORK ?

app.use((req, res, next) => { //req (the first argument) is the request
    res.status(200).json({ //At this line we are saying that we want to make the 200 (it like 404 status but the 200 means everything is ok). We have methoded that it should be JSON forma. In this line it also make use sure that we get respons 
        message: "Tanvir Ahmed!!! It is working!!!"
    });
}); //use as a method sets up called middleware. so an incoming request should have to go through app use and to whatever we pass through it.


NOTE2 : The "next" parameter is used to forward a request.
*/