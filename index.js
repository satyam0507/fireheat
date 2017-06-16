const express = require('express');
const app = express();
const admin = require("firebase-admin"),
    serviceAccount = require("./private/serviceAccountKey.json"),
    path = require('path'),
    bodyParser = require('body-parser');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fcmpush-31f7a.firebaseio.com"
});

const dataBaseRef = admin.database().ref("fireheat/");

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 4444));

app.get('/', function (req, res) {
    console.log('hahah');
    res.send('under development');
})

app.post('/', function (req, res) {
    console.log(req.body);
    res.send('under development');
});


app.listen(app.get('port'), function () {
    console.log('app at port:- ' + app.get('port'));
});