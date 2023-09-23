const express = require('express');
const app = express();
const db = require('./util/db');

setInterval(() => {
    db.checkLiving();
}, 0.5 * 60 * 1000);

app.use(express.json());

app.use('/api', require('./routes/api'));

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));