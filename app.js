
//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// const art1 = new Article({//sample entry
//     title: "jeremy",
//     content: "He is a good boy"
// });
// art1.save();

app.route("/articles").get(function(req, res) {

    Article.find({}, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);

    })
}).post(function(req, res) {

    const title1 = req.body.title;
    const content1 = req.body.content;

    const art2 = new Article({
        title: title1,
        content: content1
    })
    art2.save(function(err) {
        if (err)
            res.send(err);
        else
            res.send("New article has been created successfully");
    })
}).delete(function(req, res) {

    Article.deleteMany(function(err) {
        if (err)
            res.send("Can't delete");
        else
            res.send("Successfully deleted all articles");
    });

});

//could have used a chained route handler instead but personally prefer spearate blocks
app.get("/articles/:topic_name", function(req,res){

var articles_name= req.params.topic_name;

Article.findOne({title:articles_name},function(err,data){
  if(!err)
  res.send(data);
  else
  res.send(err);
})


})

app.put("/articles/:topic_name", function(req,res){

Article.update({title:req.params.topic_name},
  {title:req.body.title, content:req.body.content}, {overwrite:true}, function(err){
    if(!err)
    res.send("Successful overwrite")
    else
    res.send(err);
  })


})

app.delete("/articles/:topic_name", function(req,res){

Article.deleteOne({title:req.params.topic_name}, function(err){
if(err)
res.send(err);
else
res.send(req.params.topic_name + "has been deleted");
}
)

})


app.patch("/articles/:topic_name", function(req,res){

Article.update({title:req.params.topic_name},
  {$set: req.body},  function(err){
    if(!err)
    res.send("Successful update")
    else
    res.send(err);
  })


})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
