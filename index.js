const express = require('express');
const app = express();
const db = require('./util/db');

setInterval(() => {
    db.checkLiving();
}, 0.5 * 60 * 1000);

app.use(express.json());

app.use('/api', require('./routes/api'));

process.env.PORT || 3000;