const express = require('express');
const app = express();
const cors = require('cors');

const path = require('node:path');

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'static')));
app.use(cors());

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/video', (req, res) => {
    res.render('videoPage');
});

app.listen(3000, () => {
    console.log('hos server opened');
});