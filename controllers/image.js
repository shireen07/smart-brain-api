const Clarifai = require('clarifai'); //we import to use the private key

//Add private API key. We add it in the server so that users cannot see it in the Network tab of the broswer.
//Security concern.
const app = new Clarifai.App({
    apiKey: 'dc0f706ef82e40408f9a74401c6be274'
});

const handleApiCall = (req, res) => {
     //call the api in image onSubmit func
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => { 
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with Clarifai API'))
}

const handleImage = (req , res, db) => {
    const { id } = req.body;
    db('users').where('id' , '=' , id)
        .increment('entries' , 1)
        .returning('entries')
        .then(entries => {
            //console.log(entries[0]);
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get Entry count'))  
}

module.exports = {
    handleImage,
    handleApiCall
}