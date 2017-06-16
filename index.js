const express = require('express');
const admin = require("firebase-admin"),
    serviceAccount = require("./private/serviceAccountKey.json"),
    path = require('path'),
    bodyParser = require('body-parser');
const app = express();

function defaultContentTypeMiddleware(req, res, next) {
    req.headers['content-type'] = 'application/json';
    next();
}

app.use(defaultContentTypeMiddleware);
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 4444));


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fcmpush-31f7a.firebaseio.com"
});

const dataBaseRef = admin.database().ref("fireheat/");



app.get('/', function (req, res) {
    console.log('hahah');
    res.send('under development');
})

app.post('/', function (req, res) {
    if (typeof req.body === 'object') {
        var brandId = ""+req.body.brandID;
        var domain = req.body.domain.replace(/[.$\[\]\/#]/g, '-');
        var path = req.body.path.replace(/[.$\[\]\/#]/g, '-');
        var dataToPush = {
            activeTime: req.body.activeTime,
            pageheight: req.body.pageheight,
            pagewidth: req.body.pagewidth,
            data: req.body.points
        }
    }
    // console.log('brandId :: '+brandId);
    // console.log('domain :: '+domain);
    // console.log('path ::' +path);
    // console.log('dataToPush ::'+dataToPush);
    if (brandId && domain && path) {
        dataBaseRef.child(brandId).child(domain).child(path).push(dataToPush).then(function(res){
            console.log('data saved');
        }).catch(function(err){
            console.log(err);
        })
    }
    res.send('under development');
});


app.listen(app.get('port'), function () {
    console.log('app at port:- ' + app.get('port'));
});