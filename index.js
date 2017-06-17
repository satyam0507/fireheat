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

app.get('/serverData', function (req, res) {
    console.log(req.query);
    var brandID = "" + req.query.brandID;
    var domain = req.query.domain.replace(/[.$\[\]\/#]/g, ',');
    var path = req.query.path.replace(/[.$\[\]\/#]/g, ',');
    if (brandID && domain && path) {
        dataBaseRef.child(brandID + "/" + domain + "/" + path).once('value').then(function (dataSnap) {
            var data = dataSnap.val();
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(204).end();
            }
        })
    }

})

app.get('/getUrl', function (ewq, res) {
    var brandID = "" + req.query.brandID;
    if (brandID) {
        dataBaseRef.child(brandID).child('url').once('value').then(function (dataSnap) {
            var data = dataSnap.val();
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(204).end();
            }
        })
    }
})

app.get('/view/:name', function (req, res) {

    var options = {
        root: __dirname + '/',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.get('/', function (req, res) {
    console.log('hahah');
    res.send('under development');
})

app.post('/', function (req, res) {
    if (typeof req.body === 'object') {
        var brandId = "" + req.body.brandID;
        var domain = req.body.domain.replace(/[.$\[\]\/#]/g, ',');
        var path = req.body.path.replace(/[.$\[\]\/#]/g, ',');
        var dataToPush = {
            activeTime: req.body.activeTime,
            pageheight: req.body.pageheight,
            pagewidth: req.body.pagewidth,
            data: JSON.stringify(req.body.points)
        }
    }
    // console.log('brandId :: '+brandId);
    // console.log('domain :: '+domain);
    // console.log('path ::' +path);
    // console.log('dataToPush ::'+dataToPush);
    if (brandId && domain && path) {
        dataBaseRef.child(brandId).child(domain).child(path).push(dataToPush).then(function (res) {
            console.log('data saved');
        }).catch(function (err) {
            console.log(err);
        })
        dataBaseRef.child(brandId).child('url').child(domain).child(path).update({
            a: 1
        });
    }
    res.send('under development');
});


app.listen(app.get('port'), function () {
    console.log('app at port:- ' + app.get('port'));
});