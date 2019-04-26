
const handler_files = require('./lib/handlers');
const handlers = handler_files.handler;
const router = handler_files.router;
const url = require('url');
const helpers = require('./lib/helpers');


const StringDecoder = require('string_decoder').StringDecoder;

const unifiedServer = (req,res) => {

    //get the url and parse it

const parsed_url = url.parse(req.url,true);
//whenever you request for a page, true means to pass the query string
//get the path
const path = parsed_url.pathname;//what the user actually requested
const trimmedPath = path.replace(/^\/+|\/+$/g,'');//shall deal with the slashes
//get the query string as an obj

const query_string = parsed_url.query;

//get the http method
const method = req.method.toLowerCase();

//get the headers as an object
const headers = req.headers;

//get the payload,if any
//strings came one at a time
const decoder = new StringDecoder('utf-8');
let buffer = '';
req.on('data',(data)=>{
//as the data is streaming in the request event we get the data
//which is decoded to the utf-8... the buffer shall have it 
buffer += decoder.write(data);
});
req.on('end', ()=>{
//append that the decoder has ended
//even if the string is empty the end will be called
buffer += decoder.end();

//choose the handler to go to. if not found go to the not found

let choosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;
//constructor the data object
let data = {
    'trimmedPath' : trimmedPath,
    'queryString' : query_string,
    'method' : method,
    'headers' : headers,
    'payload' : helpers.parseJsonToObject(buffer)
    //go ahead and test them all they work
};

//route the request specified by the router

choosenHandler(data,(statusCode,payload) => {
   //use the status code called back to the handler or default 200
   statusCode = typeof(statusCode) == "number" ? statusCode : 200;
   //use the payload called back by the handler or default to an empty object
   
   payload = typeof(payload) === "object" ? payload : {};

   //convert the payload to our string
   payload_string = JSON.stringify(payload);

   //return the  response
   //shall pass to us json
   res.setHeader('Content-Type','application/json');
   res.writeHead(statusCode);//write the statuscode
   res.end(payload_string);
   
   if( router[trimmedPath])
   {
       console.log('yeah that path exists');
   }else{
       console.log('that path does not exist');
   }
   console.log("we are returning this response ", statusCode, payload_string)
   


});
});



}




module.exports = unifiedServer;