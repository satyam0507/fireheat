const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 4444));

app.get('/', function (req, res) {
    console.log(req);
})


app.listen(app.get('port'), function () {
    console.log('app at port:- ' + app.get('port'));
});