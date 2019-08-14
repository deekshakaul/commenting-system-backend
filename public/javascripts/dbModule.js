var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/commentApp");

AutoIncrement.initialize(connection);

var users = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    email: String,
    userId: {type: Number, autoIncrement: true, default: 0}
});
users.plugin(AutoIncrement.plugin, {model: 'User', field: 'userId', startAt:0, incrementBy: 1});
var userModel = connection.model('User', users);

var comments = new mongoose.Schema({
    commentId: { type: Number, autoIncrement: true, default: 0 },
    username: String,
    post: String,
    replies: [],
    parent: Number
});
comments.plugin(AutoIncrement.plugin, {model: 'Comment', field: 'commentId', startAt: 1, incrementBy: 1})
var comment = connection.model("Comment", comments);

exports.getComments = function (show, res) {
    if (show == "all") {
        var response = []
        comment.find({parent: 0}, function (err, posts) {
            if (err == null) {
                var iteration = 0
                posts.forEach(eachPost => {
                    comment.find({parent: eachPost.commentId}, function(err, replies){
                        iteration+=1;
                        if (err == null) {
                            eachPost.replies = replies
                            response.push(eachPost)
                            if (iteration == posts.length) {
                                res.send(response)
                            }
                        } else {
                            res.send({message: "oops", status: 404})
                        }
                    })
                })
            }
        })
    }
}

exports.signup = function (username, email, password, res) {
    var userObject = new userModel({
        username: username,
        password: password,
        email: email
        });
    userObject.save()
    res.send({message: "signed in..", status: 200})
}

exports.postComment = function (username, post, parent, res) {
    var commentObject = new comment({
        post: post,
        username: username,
        parent: parseInt(parent)
    });
    commentObject.save()
    res.send({message: "posting comment...", status: 200})
}

exports.editComment = function (username, post, commentId, res) {
    comment.update({commentId: parseInt(commentId, 10)}, { $set: { post: post }}, function (err, data) {
        if (err == null) {
            res.send({message: "post updated", status: 200})
        } else {
            res.send({message: "something went wrong", status: 404})
        }
    });
}

exports.authenticateUser = function (username, password, response) {
    console.log("username and pasword inside db module", username, password)
    userModel.find({username: username, password: password}, function (err, user) {
        if (err == null) {
            response.send({user: user[0].username, status: 200})
        } else {
            response.send({message: "oops", status: 404})
        }
    })
}