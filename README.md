# 유튜브 클론 프로젝트

**이스트소프트 백엔드 과정 오르미 11기**  
팀 프로젝트 : YouTube 클론 사이트 제작

---

## 팀 구성원

- (팀장) 허준 ([JunHur97](https://github.com/JunHur97))
- 김예은 ([yeeunkim7](https://github.com/yeeunkim7))
- 신동규 ([renetdevp](https://github.com/renetdevp))
- 이수완 ([SooowanLee](https://github.com/SooowanLee))

---

## 진행사항

| 일자       | 김예은                                 | 신동규                             | 이수완                                | 허준                                 |
| ---------- | -------------------------------------- | ---------------------------------- | ------------------------------------- | ------------------------------------ |
| 2025-04-22 | 상단바 html 개발 (html/상단바3개.html) | nav바 html 개발 (html/navBar.html) | 상단바 css 개발 (css/headerStyle.css) | nav바 css 개발 (css/navBarStyle.css) |
|2025-04-23|video 페이지 개발중 (views/yeeunkim7/*)|video page 개발중 (views/videos/*)|main page 개발중 (main/mainContent.ejs)|channel page 개발중(channel/channelpage.ejs)|
|2025-04-24|video 페이지 개발중 (views/yeeunkim7/*)|video page 개발중 (static/js/\[utils/videoPage\].js)|main page 개발중 (main/mainContent.ejs)|channel page 개발중(channel/channelpage.ejs)|
|2025-04-25|video 페이지 개발중 (views/yeeunkim7/*)|video page 개발중 (views/videos/*, static/js/[utils/videoPage].js)|main page 개발중 (views/main/*, static/js/mainPage.js)|channel page 개발중(views/[channel/channelpage].ejs)|
|2025-04-28|video 페이지, 검색 기능 개발중|videoPage 내 navBar toggle 기능 /  스페이스바로 영상 재생 및 정지 기능 개발, channels 페이지 개발중|mainPage의 videoCard에 hover 시 영상 미리보기|.|
|2025-04-29|검색 기능 개발중|videoPage/channelsPage 내 구독 기능 추가, local cache 기능 추가|mainPage의 videoCard를 태그에 따라 필터링|channelPage 개발중|

## 실행

### 개발 환경 설정
```
npm i
node app
```
### 메인 페이지
```
http://localhost:3000
```
![Main page](./static/img/README/mainPage.png)

### 영상 페이지
```
id: Number
http://localhost:3000/videos?video_id={id}
```
![Video page](./static/img/README/videoPage.png)

### 채널 페이지
```
id: Number
http://localhost:3000/channels?ch_id={id}
```
![Channel Page 1](./static/img/README/channelPage_01.png)
![Channel Page 2](./static/img/README/channelPage_02.png)