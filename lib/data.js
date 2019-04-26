/*
the file for storing and editing data

*/
//dependencies
const fs = require("fs");
const path = require("path");
const helpers = require('./helpers');

//container

const lib = {}


//define the base directory
lib.baseDir = path.join(__dirname,'/../.data');
//take where we are and jump out
lib.create = (dir,file,data,callback) => {
    //shall just write data to the .data folder
    //open the file for writing
    //wx for reading
    fs.open(lib.baseDir+'/'+dir+'/'+file+'.json','wx', (err,fileDesc) => {
      if(!err && fileDesc){
      //convert to data to string
      const stringData = JSON.stringify(data);
      //write to file and then close it
      fs.writeFile(fileDesc,stringData,(err)=>{
        if(!err){
         fs.close(fileDesc,(err)=>{
           if(!err){
             callback(false);
           }else{
               callback('error closing the file')
           }
         })
        }else{
            callback("error writing to the file");
        }
      });
      }else{
          callback(err);
      }
    });


}

//read the contents
lib.read = (dir,file,callback) => {
    fs.readFile(lib.baseDir+'/'+dir+'/'+file+'.json', 'utf-8', (err,data) => {
     //so that we do not pass the raw data lets include the JsonToObject function
      if(!err && data)
      {
        callback(false,helpers.parseJsonToObject(data));
      }else{
        callback(err,data);
      }
     
    });

}

//update the data inside a file
lib.update = (dir,file,data,callback) => {
//open the file first
//r+ meaning that we can check if the file actually exists but wx does not check
fs.open(lib.baseDir+'/'+dir+'/'+file+'.json','r+',(err,fileDesc)=>{
  //whenever a file is open there will always be a filedesc
     if(!err && fileDesc)
     {     
       const stringData = JSON.stringify(data);
       //Truncate the file before writing on top of it
       fs.ftruncate(fileDesc, (err)=>{
         //shall truncate the file for me and pass back an error
           if(!err){
              //write to the file and close it
              fs.writeFile(fileDesc,stringData,(err)=>{
                  if(!err){
                       fs.close(fileDesc,()=>{
                         if(!err){
                          callback(false);
                         }else{
                           callback("there was an error writing to your file")
                         }
                       })
                  }else{
                    callback("error writing to the existing file")
                  }
              })
           }else{
             callback("error truncating file");
           }
       });


     }else{
       callback("could not call the file could not exist here")
     }
});
}

//delete a file
lib.delete = (dir,file,callback) => {
     //we shall be doing unlinking
     fs.unlink(lib.baseDir+'/'+dir+'/'+file + '.json', (err) => {
          if(!err)
          {
            callback(false);
          }else{
            callback("the file does not exist");
          }
     })


}




//export the element
module.exports = lib;
