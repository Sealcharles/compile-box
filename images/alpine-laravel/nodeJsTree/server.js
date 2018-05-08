var express = require('express');
var app = express();
var path = require('path');
var fs = require("fs")
var process = require('process');
var laraedit = require("./laraedit.js");
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use("/public", express.static(__dirname + '/public'));

app.get('/:operation?/:id?', function (req, res) {
   laraedit.getIndex(req, res);
   
   
});
app.post('/save', function (req, res) {
   laraedit.postSave(req, res);
   
   res.end();
});
app.post('/state', function (req, res) {
   var params = req.body;
   console.log(params);
   res.send(params);
   
   res.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  console.log(path.join(__dirname + '/../'));
});


