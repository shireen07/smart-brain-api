/*Always make sure you jot down what your api design is going to look like before you actually start coding
     /--> root route that responds with 'This is working'
     /signin --> signin route for ppl to sign in --> it will be a POST req and respond with success or fail
     /register --> post req. add data to db and variable to server with new user info
     /profile/:userID --> in the home screen we need the ability to access the profile of the user so that we can display 
                          their usrename and rank. it has an optional param of userId. so each usre has their own home screen. 
                          this is a GET Request.
     /image --> a PUT request. returns the updated user object. it counts the images scanned and returns the counter
*/


const express = require('express'); //call on the express api
//when sending json objects always parse them else you get errors. so we use body-parser
const bodyParser = require('body-parser');
//include bcrypt api for hashing password.tried and tested ahshing package
const bcrypt = require('bcrypt');
//include cors app for removing errors while connecting server to FE. Remove 'Access-Control-Allow-Origin' errors from browser
const cors = require('cors');

//each route is saved in its individual js file in the controllers. we call upon the routes in the server by exporting them from that file
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


//KNEX is an sql query builder used to connect db to server.
const knex = require('knex');
const db = knex({
    client: 'pg', //pg is postgres
    connection: {
      connectionString : process.env.DATABASE_URL, //heroku database url
      ssl: true,
    }
  });

const app = express (); //create the app by running express

//middlewear for displaying HTML body:  body-parser
app.use(bodyParser.json());
//middlewear for Remove 'Access-Control-Allow-Origin' errors from browser : cors
app.use(cors());


//GET Request
app.get('/' , (req , res) => { res.send('Yay! its working..') });

//signin route
app.post('/signin', (req , res) => { signin.handleSignIn(req, res, db, bcrypt) }); //dependency injection used for knex and bcrypt

//Register Route
app.post('/register' , (req , res) => { register.handleRegister(req, res, db, bcrypt) }); //Dependency Injection: so that register.js can run the libraries without them being included in that file

//profile route
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

//image route
//update user to increase their entries count and works with post as well.
app.put('/image', (req , res) => { image.handleImage(req, res, db) })

//Clarifai Api call in image.js
app.post('/imageurl', (req , res) => { image.handleApiCall(req, res) })


app.listen(process.env.PORT || 5000, () => {
    //function runs right after listen
    console.log(`App is running on port ${process.env.PORT}`);
}); //using port 3000 to listen

