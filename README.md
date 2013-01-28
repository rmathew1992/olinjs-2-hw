#olin.js #2 — homework

**Due Monday Jan 29 before class**

After the second lesson, we should be able to create and deploy an Express app that saves data to a Mongo database.

##Reading

The [olinjs-2 repo](https://github.com/olinjs/olinjs-2) should be updated with new code that shows a few examples of things we didn't get to in class
* Breakout out our database models into it's own folder
* Showing data in HTML through jade

Go to your olinjs-2 repo folder and run `git pull`. You should see a message like 
```
remote: Counting objects: 40, done.
remote: Compressing objects: 100% (28/28), done.
remote: Total 37 (delta 13), reused 29 (delta 6)
Unpacking objects: 100% (37/37), done.
From github.com:olinjs/olinjs-2
   e2b77b6..6caddd9  master     -> origin/master
Auto-merging routes/user.js
CONFLICT (add/add): Merge conflict in routes/user.js
Auto-merging routes/index.js
CONFLICT (add/add): Merge conflict in routes/index.js
Auto-merging package.json
CONFLICT (content): Merge conflict in package.json
Auto-merging app.js
CONFLICT (add/add): Merge conflict in app.js
Automatic merge failed; fix conflicts and then commit the result.
```

This is because we edited a lot of files during class and they were edited again by me later on. If you guys have used Subversion before, you've probably seen these errors. This just means that Git tried to combine our two changes together, but since we changed the same things, Git doesn't know which change should be kept and which one should be thrown away. So open up one of the files Git says it has a merge conflict for (such as app.js) and you should see something like this

```
<<<<<<< HEAD
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'localhost');

var schema = mongoose.Schema(
  { name: 'string' }
);

var Cat = mongoose.model('cat', schema);
=======
  , User = require('./models/user')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');
>>>>>>> 6caddd920a478eacc1f9598f2647f7fddc251ea7
```

The first part is the stuff you had in your file. The second part is the stuff I modified. The long string of numbers is the commit id of the change that conflicted with your local copy of files. You get to choose which part you want to keep. Just delete the lines you don't want.

Now if you `git add app.js` and then `git commit -m "fixing merge"` and `git push` you can now push the updated code without conflicts back to your own repository.

###Path parameters
Before starting on the assignment we need to learn about *path parameters*. Path parameters are routes that have variables in them. So let's say that we have a `/users` route. What if we want to show Bob's homepage every time we went to `/users/bob`? How would we tell our server to route that to Bob's homepage? We could do something like 

```js
app.get('/users/bob', function (req, res) {
  // render bob's homepage here
});
```

No. Don't do that. What happens when our app has a million users? We'd be too busy writing all the routes to do more fun things such as 
* sleeping in our piles of money
* hookers & blow
* beating up David
* going to Vegas and betting all your money on blackjack because blackjack is an easy game to play the odds but having bad luck and losing lots of money anyway

So instead, we can tell Express to make the argument after `/users` a variable, like so

```js
app.get('/users/:user', function (req, res) {
  // render bob's homepage here
});
```

Now when our server gets hit with `/users/bob` we can get the `:user` parameter

```js
app.get('/users/:user', function (req, res) {
  console.log(req.params.user); // this logs bob if we go to /users/bob 
});
```

Every route request we do in both Express and Node have two arguments, usually designated by `req` and `res`.
* `req` is the [request object](http://expressjs.com/api.html#req.params). It is what our servers get as input when a route is hit. In this case, 
* `res` is the [response object](http://expressjs.com/api.html#res.status). It is what our servers send back to the clients. 

### A bit about jade
So by now you've probably noticed the .jade files in your `/views` directory. These .jade files are eventually what's going to get rendered into the HTML that your browser sees. 

Your app turns the .jade files into HTML through the [jade templating engine](http://jade-lang.com/). We specified that we're going to use jade in our app.js file through

```js
app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  ...
  app.set('view engine', 'jade');
  ...
});
```

Why use jade over regular html? There are lots of reasons, but the ones I can think of right now are

**Less typing** 

because typing is a skill that we are all terrible at. We don't notice only because we are also terrible at reading. 

**Reuse HTML** 

Check out facebook.com. Notice that the site has the same header and right ticker bar no matter what page you're on? Wouldn't it suck if you had to copy and paste the same HTML for that every time a developer wanted to create a new facebook page? Even if you did, what happens when you want to make the header bar have an extra button? You're going to have go to through every single file and add in that button. 

With jade, we can tell our app that we have a `template` that we want the site to look like and only write that HTML once. 

To see how this works, open up `views/index.jade` in an Express app that you created. There should be this

```jade
extends layout

block content
  h1= title
  p Welcome to #{title}
```

Now run the express app with `node app.js` and go to your localhost site. Inspect the page with your browser and you should find html like

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Express</title>
    <link rel="stylesheet" href="/stylesheets/style.css">
  </head>
  <body>
    <h1>Express</h1>
    <p>Welcome to Express</p>
  </body>
</html>
```

If you notice in `index.jade` we didn't specify the html tags, doctype, or the title and yet it's there. It's rendering that html through the `layout.jade` file which has the following

```jade
doctype 5
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
```

We're *extending* `layout.jade` through the `extends layout` line in our `index.jade` file. This means that everything that appears in `layout.jade` will appear in `index.jade`. 

After the `extends layout` line in `index.jade` we have a line that says `block content`. This line tells jade that anything *inside* of that block should go in the `block content` area in `layout.jade`. 

So the combination of `index.jade` and `layout.jade` gives us something like

```jade
doctype 5
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    h1= title
    p Welcome to #{title}
```

Which is the same thing that we see on the HTML page when we go to our localhost.

**Embedded variables** 

Another nice thing that jade gives us is the ability to embed variables inside of our HTML files. Let's go back to facebook.com. It would suck if we had to manually write in every user's name on their own page. Jade handles this for us. We can do something like

```jade
  p Welcome to #{title}
```

When we go to our localhost, we see 

```
Welcome to Express
```

We passed the title variable into jade through the following line in index.js

```js
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
```

The first argument that we passed to res.render is `index` which refers to the `index.jade` file. Our second argument is a Javascript Object (javascript objects are just key-value stores. They look like Python dictionaries). 

Jade gives us multiple ways we can embed these variables into our page. We've already seen 

```jade
  #{title}
```

Another valid form of syntax is

```jade
  h1= title
```

This sets the value of the \<h1\> tag equal to whatever the title variable is.

**Programming functionality**

You can also have things like if statements, for loops, etc in your templates. Want to display an arbitrarly long list of users in a page? Use a for loop that renders html. 

Let's suppose we have a list of users in our user.js file

```js
  res.render('users', {users: [
      {name: 'bob', class: 2013},
      {name: 'joe', class: 2011},
      {name: 'alice', class: 2011}
    ], 
    title: 'My First app'});
```

We can show an entire list of users with the following `user.jade` file

```jade
  div
    each user, i in users
      div(value=user) 
        #{user.name} graduates in #{user.class}
```

## Some parting words
In order to complete this assignment, you're also going to have to use arrays & sorting in Mongoose. We didn't cover this in class, but it's not that much of a stretch to Google. 

We encourage you to look at documentation and search for code/answers to problems that you run into. Attribute from where you copy, not just for honesty but because you'll probably run into the same issue again someday. This way, it'll be way easier to go back to where you found that answer. 

Are you running into errors that the first page of Google results doesn't solve? Email out to the mailing list. Chances are, we've already had this error before.

##Assignment

* Fork this repo to your own account
* Run `express` in the folder that you just forked to create a new express app
* Edit your `package.json` file to look like this

```json
{
  "name": "olinjs-2-hw",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node app"
  },
  "dependencies": {
    "express": "3.x",
    "jade": "*",
    "mongoose": "3.x"
  },
    "engines": {
    "node": "0.8.14 ",
    "npm": "1.1.65"
  }
}
```
* Run `npm install`
* Create an app that has the following routes
  * GET `/cats/new` => creates a new cat. Cats have a random age, a list of colors, and a name. Don't hardcode these values.
  * GET `/cats` => shows a sorted list of cats by age. This should display their names, colors, and age
  * GET `/cats/color/:color` => where :color is a parameter, such as "orange" or "grey". It shows a sorted list of cats by age that have that specific color
  * GET `/cats/delete/old` => deletes the oldest cat :c The cat should no longer appear on any lists
* deploy this to Heroku and add your app to the [homework 2 sheet](https://docs.google.com/spreadsheet/ccc?key=0AjqGw-pw5UuudFhQSmJhZlRZWEhRTWcwYmxBVld6c1E)

##References

* [MongooseJS](http://mongoosejs.com/)
* [MongoDB](http://www.mongodb.org/)
* [Jade](http://jade-lang.com/)
