// the request handlers


//dependencies
const _data = require('./data');
const helpers = require('./helpers');
const handlers = {};



handlers.sample = (data,callback) => {
    callback(200,{name:"the handler is found"})
}

handlers.router = (data,callback) => {
    callback(200,{name:"the system is working"})
}

//not found handler
handlers.notFound = (data,callback) => {
callback(404),{'Error' : 'its 404 being called here'};
};

//the friends handler


handlers.users = (data,callback) => {
acceptable_methods = ['post','get','put','delete'];
if(acceptable_methods.indexOf(data.method) > -1)
{
    return handlers.users[data.method](data,callback);
}else{
   callback(405,{'Error' : 'there are issues with the method'});
}
};

//container for the users methods


//required data frirstName,lastname,phone,password,tosAgreement
//optional data: None
handlers.users.post = (data,callback) => {
    //check all the required fields are filled up
    const first_name = typeof(data.payload.firstName) == "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const last_name = typeof(data.payload.lastName) == "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const pass = typeof(data.payload.password) == "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const toAsAgreement = typeof(data.payload.toAsAgreement) == 'boolean' && data.payload.toAsAgreement == true ? true : false;
    
    if(first_name &&  last_name && phone && pass && toAsAgreement)
    {
        //make sure the user does not already exist
        _data.read('users',phone,(err,data)=>{
         if(err)
         {
             //start by hashing the passwords
             const hashed_pwd = helpers.hash(pass);
             if(hashed_pwd)
             {
             
                const user_obj = {
                    'firstName' : first_name,
                    'lastName' : last_name,
                    'phone' : phone,
                    'hashedPassword' : hashed_pwd,
                    'toAsAgreement' : true
                };
   
                //store the user
   
                _data.create('users',phone,user_obj,(err)=>{
                    if(!err)
                    {
                        callback(200);
                    }else{
                        console.log(err);
                        callback(500,{'Error' : 'could not create the new user'});
                    }
                    })
             }else{
                 callback(500,{'Error' : 'concern on the hashed pwd'});
             }

             
             

         }else{
             //a user exists
             callback(400,{'Error' : 'A user with that phone number already exists'})
         }
        })


    }else{
        callback(400,{'Error' : 'missing the required fields'});
    }




}
//do the get
//the required data - phone
//optional data - none
//only auths access their own objs. they should not access anyones 
handlers.users.get = (data,callback) => {
 phone = typeof(data.queryString.phone) == "string" && data.queryString.phone.trim().length == 10 ? data.queryString.phone : '';
 //then we read the file
 returned_msg = _data.read('users',phone,(err,data) => {
     if(!err && data){
         //remove the hashed password from the user object before passsing
         delete data.hashedPassword;
        callback(200,{'message': data});
     }else{
        callback(400,{'message': 'there was an error fetching your file'}); 
     }
    
 });
 
}
//the put usually used for update
//the equired data is phone
//for your query to work in postman it must be in full quotes
//the optional data is everything else.. and atleast one must be specified
//@TODO only a user to update their update and no other

handlers.users.put = (data,callback) => {
     
    //we are going to load it from the payload

   const phone = typeof(data.payload.phone) == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone : false;
   
   //check the optional fields 
    const first_name = typeof(data.payload.firstName) == "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const last_name = typeof(data.payload.lastName) == "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    
    const pass = typeof(data.payload.password) == "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    
 if(phone)
{
    //continue now checking
    if(first_name || last_name || pass)
    {
       //check if the user exists
       _data.read('users',phone,(err,userData) => {
         if(!err && userData)
         {
           if(first_name){
               //update the firstname
               userData.firstName = first_name;
           }
           if(last_name){
               userData.lastName = last_name
           }
           if(pass)
           {
               userData.hashedPassword = helpers.hash(pass);
           }
           //store the new update
           _data.update('users',phone,userData,(err)=>{
           if(!err)
           {  
               callback(200,{'success': 'you have updated the file'})

           }else{
               console.log(err);
               callback(500,{'Error' : 'there was an error with '+ err});
           }
           })
         }else{
             //there is no data to update
             callback(400,{'Error' : 'the specified error do not exist'});
         }
       });
    }else{
        callback(400,{'Error' : 'nothing to update sent'});
    }
}else{
    callback(400,{'Message': 'we have this for phone ' + data.payload.phone});
}

}

handlers.friends = (data,callback) => { 
    acceptable_methods = ['post','get'];
    if(acceptable_methods.indexOf(data.method) > -1){
        return handlers.friends[data.method](data,callback)
    }else{
        callback(200,{'message' : 'the method is not included'});
    }
}
//delete
//start with the phone
//only the authenticated users to delete their objects
//delete that any other datafiles related
handlers.users.delete = (data,callback) => {
    
    phone = typeof(data.queryString.phone) == "string" && data.queryString.phone.trim().length == 10 ? data.queryString.phone : '';
    //then we read the file
    returned_msg = _data.read('users',phone,(err,data) => {
        if(!err && data){
            _data.delete('users',phone,(err) => {
             if(!err)
             {
                 callback(200);
             }else{
                 callback(400,{'Error' : 'error deleting the user'});
             }
            });   
        }else{
           callback(400,{'message': 'the user to be deleted cannot be found'}); 
        }
       
    });  
    
}
handlers.friends.get = (data,callback) =>
{
    callback(200,{'Message' : 'this is nice kennedy'});
}

//the tokens

handlers.tokens = (data,callback) => {
    acceptable_methods = ['post','get','put','delete'];
    if(acceptable_methods.indexOf(data.method) > -1)
    {
        return handlers.tokens[data.method](data,callback);
    }else{
       callback(405,{'Error' : 'the method is not supported for the tokens'});
    }
};
//post
//required data is phone num and password
//optional - none

handlers.tokens.post = (data,callback) => {
    const phone = typeof(data.payload.phone) == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const pass = typeof(data.payload.password) == "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(phone && pass)
    {
        //lookup for the person who matches the phone number
        _data.read('users',phone,(err,data)=>{
         if(!err && data)
         {
             //first hash the password and compare it with the password in the user obj
             let hashed_password = helpers.hash(pass);
             if(hashed_password == data.hashedPassword)
             {
               //create a token with a random name and set expiration date one hour
               let Token_id = helpers.createRandomString(20);
               let expires = Date.now() + 1000 * 60 * 60;
               //store the tokenid
               let TokenObj ={
                   'phone' : phone,
                   'id' : Token_id,
                   'expires' : expires
               }
               //lets call the create method
               _data.create('token',Token_id,TokenObj,(err)=>{
                  if(!err){
                      callback(200,TokenObj);
                  }else{
                      callback(500,{'error' : 'error creating the token'});
                  }
               })

             }else{
                 callback(400,{'Error' : 'the passwords do not match '+ data.firstName});
             }

         }else{
             callback(400,{'Error' : 'could not find the specified user'});
         }
        })

    }else{
      callback(402,{'Error' : 'phone and password not sufficiently passed'});
    }
}

//get
//the required data is just an id and the optional data is none
//check the id that they sent is valid
handlers.tokens.get = (data,callback) => {

     id = typeof(data.queryString.id) == "string" && data.queryString.id.trim().length == 20 ? data.queryString.id : '';
     //then we read the file
     if(id)
     {
        returned_msg = _data.read('token',id,(err,tokenData) => {
            if(!err && tokenData){
                
               callback(200,{'message': tokenData});
            }else{
               callback(400,{'message': 'there was an error fetching your file'}); 
            }
           
        });
     }else{
         callback(500,{'Error' : 'there is an error with the id its length '+ data.queryString.id.trim().length});
     }
}

//put
//there shall be two required fields..
//we allow users to send and extend true
//payload means in the postman we are going to write the data in the body section
//optional data is none
handlers.tokens.put = (data,callback) => {
    let id = typeof(data.payload.id) == "string" && data.payload.id.trim().length == 20 ? data.payload.id : '';
    let extend = typeof(data.payload.extend) == "boolean" && data.payload.extend ? true : false;
    if(id && extend)
    {
    
         //look up the token
         _data.read('token',id,(err,data)=>{
           if(!err && data)
           {
               //check the user do have their expired sesions
               if(data.expires > Date.now())
               {
                   //set the exporation an hour from hour 
                   data.expires = Date.now() + 1000 * 60 * 60;
                   //strore the new 
                   _data.update('token',id,data,(err) => {
                      if(!err)
                      {
                         callback(200);
                      }else{
                          callback(400,{'Error' : 'some error occurred when updating'});
                      }
                   });
               }else{
                   callback(400,{'Error' : 'the token has already expired'});
               }

           }else{
               callback(400,{'error' : 'the token do not exists'});
           }
         })
    }else{
        callback(400,{'Error' : 'some important information needed '+ id + ' and '+ data.payload.id});
    }



}

//delete

handlers.tokens.delete = (data,callback) => {

}


//define a request router
//please dont leave a space here
const router = {
    'sample' : handlers.sample,
    'router' : handlers.router,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'friends' : handlers.friends
    };



//export multiple here
module.exports = {
    'handler' : handlers,
    'router' : router,
    
}
