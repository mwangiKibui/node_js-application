/*
   primary file of the APi
   touch makes a file whereas mkdir is for dir in bash
*/
//Dependencies
const http = require('http');
const https = require('https');
const unifiedServer = require('./server');
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');
//the stringdecoder library consists alot of decoders we have to call it




// instantiate the server
const httpServer = http.createServer( (req,res) => {
    unifiedServer(req,res);     
});

//start the server
httpServer.listen(config.httpPort, () => {
    console.log("the server is listening on port "+ config.httpPort)
});

//instantiate the https server
//we need the key and the cert
//reading the  file and assigning to a variable
const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
    unifiedServer(req,res);
});

//start the https server

httpsServer.listen(config.httpsPort, () => {
    console.log("the server is listening on port "+ config.httpsPort)
});

//All the server logic for both the http and https


