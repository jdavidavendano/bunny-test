/* Tasks microservice */ 

const express = require('express');
const bodyParser = require('body-parser');
const port = 3001;      /* Temporarily fixed */
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/bunny-tasks-firebase-adminsdk-f41lq-3374103695.json");
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
    databaseURL: "https://bunny-tasks.firebaseio.com",
    databaseAuthVariableOverride: null
});
  
const db = admin.firestore();

app.options('*', cors())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.get('/**', cors(corsOptions), (req, res) => {
    try {
        let listTasks = {};
        let collectionTasks = db.collection('tasks');
        let userIdToQuery = req.params[0];

        collectionTasks.where('user_id', '==', userIdToQuery).get().then(
            tasks => {
                if (tasks.empty) {
                    res.status(202).send({});
                    console.log('No matching documents.');
                    return;
                }  
                tasks.forEach(task => {
                    let taskIdTmp = task.id;
                    let taskDataTmp = task.data();
                    taskDataTmp['id'] = task.id;
                    listTasks[taskIdTmp] = taskDataTmp;
            });
            res.status(202).send(listTasks);
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    } catch (error) {
        console.error(error);
    }
});

app.post('/', cors(corsOptions), (req, res) => {
    try {
        let collectionTasks = db.collection("tasks");
        collectionTasks.doc().set({
            description: req.body.description,
            state: req.body.state,
            user_id: req.body.user_id
          }).then(function() {
            res.status(202).send(req.body);
          });
    } catch (error){
        console.error(error);
    }
});

app.put('/**', cors(corsOptions), (req, res) => {
    try {
        db.collection('tasks').doc(req.body.id).update({
            description: req.body.description,
            state: req.body.state,
            user_id: req.body.user_id
        })
        res.status(202).send()
    } catch (error) {
        console.error(error);
        res.status(404).send();
    }
});

console.log(`Service listening on port ${port}`);
app.listen(port);
