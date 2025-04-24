const express = require('express');
const app = express();
const cors = require('cors');

const path = require('node:path');

app.set('view engine', 'ejs');
// https://stackoverflow.com/questions/25858431/when-using-express-with-nodejs-how-does-view-cache-work
// view cache는 dev 환경에선 설정되지 않으니 굳이 꺼줄 필요도 없음
// app.set('view cache', false);
app.use('/public', express.static(path.join(__dirname, 'static')));
app.use(cors());

app.get("/", (req, res) => {
  res.render("main");
});

app.get('/video', (req, res) => {
    res.render('videoPage');
});

app.get('/channel', (req, res) => {
    res.render('channelpage');
});

app.listen(3000, () => {
    console.log('hos server opened');
});
