
const handleRegister = (req, res, db , bcrypt) => {
    //new user created
    const { name , email , password} = req.body; //grab values from post req from postman
    
    if(!email || !name || !password){
        return res.status(400).json('Incorrect Form Submission')
    }

    //hashing the password
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    // bcrypt.compareSync(password, hash); // true
    // bcrypt.compareSync("veggies", hash); // false

    //add a new user to database
    //create a transaction so that data added in both users and login tables
    db.transaction(trx => {
        trx.insert({
            hash : hash,
            email : email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*') //knex method- users insert a row and return all cols
                .insert({
                    email : loginEmail[0],
                    name : name,
                    joined : new Date()
                })
                .then(user => {
                    res.json(user[0]); //grabs the last item in array
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })   
        .catch(err => res.status(400).json('UNABLE TO REGISTER!'))
}

module.exports = {
    handleRegister : handleRegister
};