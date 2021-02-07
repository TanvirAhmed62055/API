/*
We want to make sure that all the protected routes are protecte and want to make sure not all users
can access them.

Therefore we need something way of protecting the routes. A good approach is to add some kind of middleware
which easily add to the middle route that runs prior to the route that is getting processed. To actually determine does
it make sence to continue aren't you already authenticated.

So we need to add some middleware that checks for a valid token to be there and only if the token is there and valid can be verified
( if the token is not messed around with on it the client ) if that is the case then WE CONTINUE.

So that is the plan.
*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]; // Here we requesting the token from the header and split by wide space and want to access the first index
        // console.log(token); // to print the token in the terminal
        const decoded = jwt.verify(token, process.env.JWT_KEY); //  This will verify weather the token is valid or not
        req.userData = decoded; // Here we are requesting for userData
        next();
    } catch (error){
        return res.status(401).json({
            message: 'ACCESS DENIED'
        });
    }
    
};