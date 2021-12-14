var path = require('path')
require('dotenv').load();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false})

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(urlencoded);

var port = process.env.PORT || 3000

var server = require('http').createServer(app);
server.listen(port);
console.log("listen to port " + port)
var rc_engine = require('./engine');

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/readlogs', async function (req, res) {
  await rc_engine.login(req, res)
})
