var express = require("express");
var bodyParser = require("body-parser");
var router = require("./routes/route");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


var logtime=function (req,res,next){
    console.log('Request received at  '+ Date.now());
     next();    
}
var logURL=function (req,res,next){
    console.log('Request URL is  '+ req.url);
    next(); 
}
    
    // Using body-parser to handle post requests throughout the app 
    app.use(logtime);
    app.use(logURL);


app.use("/", router);

app.all('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
}); 

app.use(function(err, req, res, next) {
     res.send({message : 'Requested URL is not available', status:404});
}); 



app.listen(3000);
console.log("server running");

module.exports = app;
