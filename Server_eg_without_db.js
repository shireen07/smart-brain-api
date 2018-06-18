// 

const express = require('express'); //call on the express api
//when sending json objects always parse them else you get errors. so we use body-parser
const bodyParser = require('body-parser');
//include bcrypt api for hashing password.tried and tested ahshing package
const bcrypt = require('bcrypt');
//include cors app for removing errors while connecting server to FE. Remove 'Access-Control-Allow-Origin' errors from browser
const cors = require('cors');


const app = express (); //create the app by running express


//middlewear for displaying HTML body:  body-parser
app.use(bodyParser.json());
//middlewear for Remove 'Access-Control-Allow-Origin' errors from browser : cors
app.use(cors());



const database = {
    users : [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

//GET Request
app.get('/' , (req , res) => {
    res.send(database.users);
});


//signin route
app.post('/signin', (req , res) => {
    //compare the hashes saved as password for successful login
        //     // Load hash from your password DB.
        // bcrypt.compare(password, hash, function(err, res) {
        //     // res == true
        // });
        // bcrypt.compare('someOtherPlaintextPassword', hash, function(err, res) {
        //     // res == false
        // });
        //OR.......................................
        // bcrypt.compare('apples', '$2b$10$jedYY8HbmyhFATqC2B6CyuNhTYDadgn3J9qRWE6ajgsfOzHloRn0i', function(err, res) {
        //     console.log('first guess', res);
        //  });
        //  bcrypt.compare('veggies', hash, function(err, res) {
        //      console.log('second guess', res);
        //  });

    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
          res.json(database.users[0]);  
    } else {
        res.status(400).json('Error Logging in!');
    }
});


//Register Route
app.post('/register' , (req , res) => {
    //new user created
    const { name , email , password} = req.body; //grab values from post req from postman

    //using bcrypt api for hashing password
    const saltRounds = 10; //requirement for bcrypt api
    bcrypt.hash(password, saltRounds, function(err, hash) {
        console.log(hash);
      });

    database.users.push({
        id: '125',
            name: name,
            email: email,
            entries: 0,
            joined: new Date()
    }); //push used to add to users array
    res.json(database.users[database.users.length-1]); //grabs the last item in array
});


//profile route
app.get('/profile/:id', (req , res) => {
    //each profile comes with the user id. grab the id first
    const { id } = req.params;
    let found = false;
    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json('No such User');
    }
})


//image route
//update user to increase their entries count and works with post as well.
app.put('/image', (req , res) => {
    //find the id of user first so we can update their entries
    const { id } = req.body;
    let found = false;
    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('No Entries Added');
    }
})



//using bcrypt api for hashing password
// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//     // Store hash in your password DB.
//   });
//   // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
//     // res == false
// });



app.listen(3000, () => {
    //function runs right after listen
    console.log("App is running on port 3000");
}); //using port 3000 to listen

/*Always make sure you jot down what your api design is going to look like before you actually start coding
     /--> root route that responds with 'This is working'
     /signin --> signin route for ppl to sign in --> it will be a POST req and respond with success or fail
     /register --> post req. add data to db and variable to server with new user info
     /profile/:userID --> in the home screen we need the ability to access the profile of the user so that we can display 
                          their usrename and rank. it has an optional param of userId. so each usre has their own home screen. 
                          this is a GET Request.
     /image --> a PUT request. returns the updated user object. it counts the images scanned and returns the counter



     
*/