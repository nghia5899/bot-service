const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const route = require('./routes/index_routes')
const path = require('path')
const job = require('./job/job.js')

const app = express();

const port = process.env.PORT || 3000;

const mongodb = require('./config/init_mongodb')

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.json());

route(app);


app.listen(process.env.PORT || 3000, function() {
    console.log('Node server running @ http://localhost:'+ port + '...');
})