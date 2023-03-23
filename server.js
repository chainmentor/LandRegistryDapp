var express = require('express');
var app = express();
app.use(express.json());

const routes = require('./src/routes');
app.use('/',routes);

app.listen(9600);
console.log("server Listening On port-9600");