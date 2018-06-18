
const handleProfileGet = (req , res, db) => {
    //each profile comes with the user id. grab the id first
    const { id } = req.params;
    db.select('*').from('users').where({id}) //id : id both key and val are the same
        .then(user => {
            if(user.length){ //if array not empty 
                res.json(user[0])
            } else {
                res.status(400).json('User not found');
            }
        })
        .catch(err => res.status(400).json('Error getting User'))
}

module.exports = {
    handleProfileGet : handleProfileGet
}