/*

we shall have some helper functions here

*/
const crypto = require('crypto');
const config = require('../config');
//container for all helpers



const helpers = {

}
//create a SHA256 hash

helpers.hash = (str) => {
    if(typeof (str) == 'string' && str.length > 0)
    {
        //then encyrpt it
        const hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;

    }else{
        return false;
    }
}
//create alpha numerric characters which are random and of a given length

helpers.createRandomString = (strLength) => {
   if(strLength > 0 && typeof(strLength) == "number"){
     //define all the possible chars
     const chars = 'abcdefghijklmnopqrstvxwyz0987654321';

     //start the final string
     let str = '';

     for(i = 0; i < strLength; i++)
     {
         //get a random char from the possible chars
         //grab a random number between the firts pos and the last pos of the string
         //and then we shall use charAt to grab the actual character at that pos
         random_str = chars.charAt(Math.floor(Math.random() * chars.length));

         //append the char to the final str
        str += random_str;
     }
     //return final str
     return str;

   }else{
       return false;
   }
}



//either return a json or false

helpers.parseJsonToObject = (str) => {
    //if it can parse the str to json then return it otherwise return empty obj

    try{
        const obj = JSON.parse(str);
        return obj;
    }catch{
        return {'Error' : 'check the helpers here' };
    }
}

module.exports = helpers;