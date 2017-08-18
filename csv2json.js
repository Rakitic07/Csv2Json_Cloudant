var fs = require('fs');
var cloudant = require('cloudant');

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials;
        }
    }
}

var dbCredentials;
function initDBConnection() {
    if (process.env.VCAP_SERVICES) {
        dbCredentials = getDBCredentialsUrl(process.env.VCAP_SERVICES);
        return dbCredentials;
    } else { 
        dbCredentials = getDBCredentialsUrl(fs.readFileSync("myJASON.json", "utf-8")); 
        return dbCredentials;
    }
};

var cred = initDBConnection();
var uname = '121ed65d-c858-4398-aae1-46ee4412c6ca-bluemix';
var pwd = '42794d65ed772dffb67d878bc16737d5736b1b83f907184ec04913cc24dc7429';
var cloudant = cloudant({account:uname , password:pwd});



var csvfile = fs.readFileSync('CSV.csv').toString();

csvfile = csvfile.split("\n");

var column_header = csvfile.shift().split(",");

var jsonarray = [];
csvfile.forEach(function(part) {
    temp = {}
    row = part.split(",")
    for(var i = 0; i < column_header.length; i++) {
        temp[column_header[i]] = row[i];
    }
    jsonarray.push(temp);
});

//var x = JSON.stringify(jsonarray)
var a = cloudant.db.use('testdb');
a.insert({jsonarray},
function(err, body) {
if(err)
    return console.log(err);
});



