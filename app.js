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

const contentNumbers = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const videoList = Array.from({ length: 16 }, () => ({
  videoSrc: '/videos/sample1.mp4',
  poster: ` /public/img/videoPage/rVideo${contentNumbers(1, 8)}.png`,
  userProfile: `/public/img/navBar/subUserIcon${contentNumbers(1, 7)}.svg`,
  description: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.',
  username: 'James Gouse',
  views: '15K views 1 week ago',
  runningTime: '23:45',
}));

const mainPageButton = [];
for (let i = 0; i < 20; i++) {
  mainPageButton.push({ content: i === 0 ? 'All' : 'Item' });
}


app.get('/channel', (req, res) => {
    res.render('channelpage');
});

app.get('/', (req, res) => {
    res.render('main', { videoList, mainPageButton });
});

app.get('/video', (req, res) => {
    res.render('videoPage');
});

app.listen(3000, () => {
    console.log('hos server opened');
});