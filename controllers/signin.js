
const handleSignIn = (req, res, db, bcrypt) => {
    
    db.select('email' , 'hash').from('login')
    .where('email','=',req.body.email)
    .then(data => {
        //console.log(data[0])
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('Unable to get the User'))
        } else {
            res.status(400).json('Wrong Credentials..')
        }
    })
    .catch(err => res.status(400).json('Unable to Sign In!Wrong Credentials..'))
}

module.exports = {
    handleSignIn : handleSignIn
}