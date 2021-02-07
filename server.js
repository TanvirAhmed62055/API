const http = require('http');
const app = require('./app') // Here we are importing app.js
const port = process.env.PORT || 3000 ; //Here we are saying that use either the environment port if not not use the port 3000

const server = http.createServer(app)
//To create the server we need to pass a listener. Function in which essentially is executed whenever we got a new request 
// and then return response which is responsible for it.

server.listen(port); //server.listen is used to start the server and we will pass the port as an argument  
