const express = require('express');
const app = express();
const cors = require('cors');
const path = require('node:path');

app.set('view engine', 'ejs');

// 정적 파일 경로 설정
app.use('/public', express.static(path.join(__dirname, 'static')));

// CORS 허용
app.use(cors());

// 메인 페이지
app.get("/", (req, res) => {
  res.render("main");
});

// ✅ 수정: videoPage 경로를 yeeunkim7 폴더 내부로!
app.get('/video', (req, res) => {
<<<<<<< HEAD
  res.render('yeeunkim7/videoPage');
=======
    res.render('videos/videoPage');
>>>>>>> 42cc8a4dbf9c08662671686d4033db1ef49c7632
});

// 채널 페이지
app.get('/channel', (req, res) => {
  res.render('channelpage');
});

// 서버 시작
app.listen(3000, () => {
  console.log('hos server opened');
});