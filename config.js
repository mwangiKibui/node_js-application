/*
create and export configuration variables
*/

//container for all the environments
const environments = {};
// the staging environment
environments.staging = {
    
    'httpPort' : 3000,
    'httpsPort': 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret'


};

// the production argument
environments.production = {
     'httpPort' : 5000,
     'httpsPort' : 5001,
     'envName' : 'production',
     'hashingSecret' : 'thisIsASecret'
}

//determine which to be passed as a command line arguments

const currentEnvironment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : ' ';
 
//check the current environment is the one defined as one of the keys up there

let enviromentToExport = typeof(currentEnvironment) == "object" ? environments[currentEnvironment] : environments.staging;

//export the module
module.exports = enviromentToExport;



