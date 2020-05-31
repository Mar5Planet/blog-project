//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const Schema = mongoose.Schema;
const homeStartingContent = "Welcome to the intergalactic Journal Planet. Press the CREATE button to start sharing your out of this World stories!"


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = new Schema ({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req,res){
  Post.find({}, function(err, posts){
    res.render("home", {paragraphVale: homeStartingContent,
      posts: posts});
  })





});


app.get("/compose", function(req,res){

  res.render("compose");
});


  app.post("/compose", function(req, res){
 //must use req.body and the name of the input
  const blogPost = new Post ({
   title: req.body.postTitle,
   content: req.body.postBody
  })
    blogPost.save();

    res.redirect("/");
  });

app.get("/posts/:postName", function(req,res){
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.find({}, function(err, posts){
    posts.forEach(function(post){
      const storedTitle = _.lowerCase(post.title);

      if (storedTitle === requestedTitle) {
        res.render("post", {postHeading: post.title, postParagraph: post.content});
      }
      else {
        console.log("Not a Match!")
      }
  })


  });






});










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
