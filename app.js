const express = require('express');
const app = express();
const cors = require('cors');
const path = require('node:path');

const connect = require('./connect');
const distanceRouter = require('./routes/distanceRouter');

require('dotenv').config();

(async () => {
  await connect();
})();

app.set('view engine', 'ejs');

// 정적 파일 경로 설정
app.use('/public', express.static(path.join(__dirname, 'static')));

// CORS 허용
app.use(cors());

app.use('/distances', distanceRouter);

// 메인 페이지
app.get("/", (req, res) => {
  res.render("main");
});

// ✅ 수정: videoPage 경로를 yeeunkim7 폴더 내부로!
app.get('/video', (req, res) => {
  res.render('yeeunkim7/videoPage');
});

app.get('/videos', (req, res) => {
    res.render('videos/videoPage');
});

// 채널 페이지
app.get('/channel', (req, res) => {
  res.render('channelpage');
});

app.get('/channels', (req, res) => {
    res.render('channels/channelpage');
});

// 검색 페이지 연결
app.get('/search', (req, res) => {
  const searchQuery = req.query.search;
  res.render('searchPage', { searchQuery });
});

// 서버 시작
app.listen(3000, () => {
    console.log('hos server opened');
});