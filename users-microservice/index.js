/* Users microservice */ 

const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;      /* Temporarily fixed */
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/bunny-users-31bc3-firebase-adminsdk-ipfk8-091f0a1f2a.json");
const cors = require('cors');

const whitelist = ['http://localhost:8080', 'http://181.135.251.250:8080']
const corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bunny-users-31bc3.firebaseio.com",
    databaseAuthVariableOverride: null
});
  
const db = admin.firestore();

app.options('*', cors())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.get('/', cors(corsOptions), (req, res) => {
    try {
        let listUsers = {};
        let collectionUsers = db.collection('users');
        
        collectionUsers.get().then(
            users => {
                if (users.empty) {
                    res.status(202).send({});
                    console.log('No matching documents.');
                    return;
                }  
                users.forEach(user => {
                    let userIdTmp = user.id;
                    let userDataTmp = user.data();
                    userDataTmp['id'] = user.id;
                    listUsers[userIdTmp] = userDataTmp;
                });
                res.status(202).send(listUsers);
            }
        ).catch(err => {
            res.status(202).send({});
            console.log('Error getting documents', err);
        });
    } catch (error) {
        res.status(202).send({});
        console.error(error);
    }
});

app.post('/', cors(corsOptions), (req, res) => {
    try {
        let collectionUsers = db.collection("users");
        collectionUsers.doc().set({
            name: req.body.name
        }).then(function() {
            res.status(202).send(req.body);
        });
        console.log(req.body);
    } catch (error){
        console.error(error);
    }
});

app.put('/**', cors(corsOptions), (req, res) => {
    try {
        db.collection('users').doc(req.body.id).update({name: req.body.name})
        res.status(202).send()
    } catch (error) {
        console.error(error);
        res.status(404).send();
    }
});


app.delete('/**', cors(corsOptions), (req, res) => {
    try {
        let userIdToDelete = req.params[0];
        db.collection('users').doc(userIdToDelete).delete();
        res.status(200).send();
    } catch (error) {
        res.status(204).send();
        console.error(error);
    }
});

console.log(`Service listening on port ${port}`);
app.listen(port);
