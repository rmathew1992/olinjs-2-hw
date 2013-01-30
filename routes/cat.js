// routes for users
var Cat = require('../models/cat')

// listing all the cats
exports.list = function(req, res){
  // get the list of users
  var cats = Cat.find({}).sort('age').exec(function (err, docs) {
    if (err)
      return console.log("error", cats);
    // send it back
    res.render('cat', {cats: docs, title: "Anything?"});
  });
};

// creating a new user
exports.create = function(req, res){
  //Creat a new Cat 
   var kitty = new Cat()
   //Possible names
   var names_of_cats = ['Ralph','Jane','Edwardo','Albert'];
    
   kitty.name = names_of_cats [Math.floor(Math.random()*4)];
   kitty.age = Math.floor(Math.random()*10+1);
   // Random number of colors
   function pop_array(){
     var colors_of_cat = ['black','orange','white','tan','creme','pink'];
     var index = Math.floor(Math.random() * 5);
     var A = new Array ()
     A.length=index
     var x=0
      while(x<index){
       A[x]=colors_of_cat[Math.floor(Math.random()*5)]
       x=x+1
      }
      return A
    }
    
    kitty.color=pop_array()
    kitty.save(function (err) {
     if (err) // ...
     console.log('meow');
     });
   
    res.send('You just made a new cat!')  
}

//find cats of a certain color
exports.color = function(req, res){
  var test = req.params.color;
  var cats = Cat.find({'color':test }).exec(function (err,docs) {
    if (err)
      return console.log("No cats of");
    res.render('cat', {cats: docs, title: 'Cat colors'});
  })
}



exports.delete = function(req, res){
  var cats = Cat.find({}).sort('-age').exec(function (err,docs) {
    if (err)
      return console.log("Meow");
    
    docs[0].remove();
    res.send("Another one bites the dust")
    
  })
};

