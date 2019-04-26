//sample handler
handlers.sample = (data,callback) => {
    //callback a http status code
    //and a payload
    callback(406,{name:"sample handler"});
    };
    
    handlers.sweet = (data,callback) => {
    callback("status",{school:"karatina university",string:data.payload});
    }