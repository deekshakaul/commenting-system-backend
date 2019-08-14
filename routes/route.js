var express = require("express");
var router = express.Router();
var dbModule = require("../public/javascripts/dbModule");
var session = require("express-session");

// Since their are no complex conditions for access control etc the routes are all 
// written in route.js and all DB actions are written in dbModule.js

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
 }); 

 // MARK: Perform Action for post comment

router.post("/post_comment", function(req, res) {
    console.log("posting comment..")
    var post = req.body.post
    var username = req.body.username
    var parent = req.body.parent
    dbModule.postComment(username, post, parent, res);
});

// MARK: Perform Action for edit comment
router.post("/edit_comment", function(req, res) {
    console.log("editing comment..")
    var post = req.body.post
    var username = req.body.username
    var commentId = parseInt(req.body.commentId)
    dbModule.editComment(username, post, commentId, res);
});

// MARK: Perform Action for get comments

router.get("/show_comments", function(req, res) {
    var show = req.query.show
    dbModule.getComments(show, res);
});

// MARK: Perform Action for signup

router.post("/signup", function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    dbModule.signup(username, email, password, res);
})

// MARK: perform Action for login

router.post('/login', function(req, res) {
    console.log("Request For Login Received");
     var username = req.body.username;
     var password= req.body.password;
     dbModule.authenticateUser(username,password,res);
});

router.get('/', function(req, res) {
    res.json({"message": "Welcome to CommentApp application"});
}); 

// MARK: Perform Action for logout

router.get('/logout', function (req, res) {
    delete req.session;
    res.redirect('/');
  });

module.exports = router;
