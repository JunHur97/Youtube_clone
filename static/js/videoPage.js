import { getVideo, getChannel, getVideos, getSimilarity } from './modules/axiosReq.js';
import { onSubBtnClick } from './subscribe.js';
import { getDataFromCache, insertDataInCache } from './localCache.js';

/**
 * 
 * @param {string} urlSearch 
 * @returns 
 */
function getVideoId(urlSearch){
  const hos = urlSearch.slice(1).split('&').filter(v => v.startsWith('video_id'));
  return hos[0].split('=')[1];
}

function setVideoInfo(videoInfo){
  $('.videoPlayer')[0].src = `https://storage.googleapis.com/youtube-clone-video/${videoInfo.id}.mp4`;
  $('.videoMetadata .title')[0].textContent = videoInfo.title;
  $('.videoMetadata .uploadDate')[0].textContent = moment(videoInfo.created_dt).format('MMM D, YYYY');
  $('.videoMetadata .views')[0].textContent = `${nFormatter(videoInfo.views, 1)} views`;
  $('.videoMetadata .dislikes p')[0].innerText = nFormatter(videoInfo.dislikes, 1);
  $('.videoMetadata .likes p')[0].innerText = nFormatter(videoInfo.likes, 1);
  $('.videoDescription .videoDescText')[0].innerText = videoInfo.description;
};

function setChannelInfo(channelInfo){
  $('.videoUploader img')[0].src = channelInfo.channel_profile;
  $('.videoUploader > a')[0].href = `/channels?ch_id=${channelInfo.id}`;
  $('.videoUploader > button')[0].setAttribute('chId', channelInfo.id);
  $('.uploaderInfo .uploaderName')[0].innerText = channelInfo.channel_name;
  $('.uploaderInfo .uploaderName')[0].href = `/channels?ch_id=${channelInfo.id}`;
  $('.uploaderInfo .uploaderSubscribers')[0].innerText = `${nFormatter(channelInfo.subscribers, 1)} subscribers`;

  setSubBtn(channelInfo.id);
};

/**
 * 
 * @param {string} title 
 */
function setDocumentTitle(title){
  document.title = title;
}

function setVideoKeyControl(){
  $(document).keypress((e) => {
    if (e.target.getAttribute('type') === 'text') return;

    e.preventDefault();

    if (e.key === ' '){
      if (e.target.getAttribute('class') === 'videoPlayer') return;
      const video = $('.videoMain > .videoPlayer')[0];

      video.paused ? video.play() : video.pause();
    }
  });
}

/**
 * 
 * @param {string} chId 
 * @returns 
 */
function setSubBtn(chId){
  const subList = JSON.parse(getDataFromCache('subList'));

  if (!subList) return;

  if (subList.includes(chId)){
    const uploaderBtn = $('.videoUploader > button')[0];

    uploaderBtn.setAttribute('subscribed', '');
    uploaderBtn.innerText = 'SUBSCRIBED';
  }
}

function setSubBtnOnClick(){
  const subBtn = $('.videoUploader > button')[0];

  // subscribe.js/onSubBtnClick()
  subBtn.addEventListener('click', onSubBtnClick);
}

function addCommentIntoCache(vId, comment){
  const comments = JSON.parse(getDataFromCache(`comments_${vId}`));

  // comment.uid는 1부터 시작
  if (!Array.isArray(comments)){
    insertDataInCache(`comments_${vId}`, JSON.stringify([comment]));
    return;
  }

  comments.push(comment);
  insertDataInCache(`comments_${vId}`, JSON.stringify(comments));
}

function addComment(comment){
  const vId = getVideoId(window.location.search);
  const commentObject = {
    comment,
    createdAt: Date.now(),
    uid: Math.floor(Math.random()*7+1),
  };

  addCommentIntoCache(vId, commentObject);
  renderCommentOne(commentObject);
  const comments = JSON.parse(getDataFromCache(`comments_${vId}`));
  $('.commentInfo > p')[0].innerText = `${comments.length} comments`;
}

function setCommentKeyControl(){
  $('.commentInput input').keypress((e) => {
    if (e.key === 'Enter'){
      const input = $('.commentInput input')[0].value;

      $('.commentInput input')[0].value = '';

      if (input.trim() === '') return;

      addComment(input);
    }
  });
}

function renderCommentOne(comment){
  const userName = [
    '',
    'James Gouse',
    'Alan Cooper',
    'Marcus Levin',
    'Alexis Sears',
    'Jesica Lambert',
    'Anna White',
    'Skylar Dias',
  ];

  const commentHtml = `
    <div class="comment">
      <img src="/public/img/navBar/subUserIcon${comment.uid}.svg" >
      <div class="commentTop">
          <div class="commentInfo">
              <div class="commentAuthor">${userName[comment.uid]}</div>
              <div class="commentCreatedAt">${moment(comment.createdAt).fromNow()}</div>
          </div>
          <div class="commentContent">${comment.comment}</div>
      </div>
      <div class="commentBottom">
          <div class="commentLike">
              <img src="/public/img/videoPage/likeIcon.svg" alt="">
              <p>3</p>
          </div>
          <div class="commentDislike">
              <img src="/public/img/videoPage/dislikeIcon.svg" alt="">
              <p></p>
          </div>
          <div class="commentReply">
              REPLY
          </div>
      </div>
    </div>`;

  $('.comments')[0].insertAdjacentHTML('beforeend', commentHtml);
}

function renderComments(comments){
  $('.commentInfo > p')[0].innerText = `${comments.length} comments`;

  for (let comment of comments){
    renderCommentOne(comment);
  }
}

function setComments(){
  const vId = getVideoId(window.location.search);
  const comments = JSON.parse(getDataFromCache(`comments_${vId}`));

  if (!Array.isArray(comments) || comments.length === 0){
    $('.commentInfo > p')[0].innerText = '0 comments';

    return;
  }

  renderComments(comments);
}

async function setVideoMain(){
  const videoId = getVideoId(window.location.search);

  try {
    const res = await getVideo(videoId);
    const channelRes = await getChannel(res.channel_id);

    setVideoInfo(res);
    setChannelInfo(channelRes);
    setDocumentTitle(res.title);
    setVideoKeyControl();
    setSubBtnOnClick();
    setCommentKeyControl();
    setComments();
  }catch (e){
    axiosErrorHandler(e);
  }
}

function getSimilarityAvg(similarity, length){
  let sum = 0;

  similarity.tagPairs.forEach((d) => {
    sum += d.distance;
  });

  return sum / length;
}

function renderRVideo(rVideo){
  const video = `
  <div class="rVideo">
    <a href="/videos?video_id=${rVideo.id}">
      <img src="${rVideo.thumbnail}">
    </a>
    <div class="rVideoInfo">
      <a class="rVideoTitle" href="/videos?video_id=${rVideo.id}">${rVideo.title}</a>
      <a class="rVideoUploader" href="/channels?ch_id=${rVideo.channel_id}">${rVideo.chRes.channel_name}</a>
      <div class="rVideoBottom">
        <p>${nFormatter(rVideo.views, 1)} views</p>
        <p>${moment(rVideo.created_dt).fromNow()}</p>
      </div>
    </div>
  </div>`;

  $('.videoNav')[0].insertAdjacentHTML('beforeend', video);
}

/**
 * 
 * @param {Array<object>} rVideos 
 * @returns 
 */
function sortRVideos(rVideos){
  return rVideos.sort(function (a, b){
    if (a.simAvg < b.simAvg) return 1;
    if (a.simAvg > b.simAvg) return -1;
    return 0;
  });
}

async function getSortedRVideos(videos, selfTags){
  const result = [];

  // https://constructionsite.tistory.com/43
  // Array.forEach()는 Promises를 기다리지 않음
  // 기존에 forEach를 통해 videos를 순회하며 result 배열을 채워넣을 생각이었지만, 상기한 forEach의 특성으로 잘 동작하지 않음
  const hos = videos.map(async (v) => {
    if (v.id === parseInt(getVideoId(window.location.search), 10)) return;

    const similarity = await getSimilarity([selfTags, v.tags]);
    const simAvg = getSimilarityAvg(similarity, selfTags.length*v.tags.length);

    const chRes = await getChannel(v.channel_id);

    result.push({ ...v, chRes, simAvg });
  });

  await Promise.all(hos);

  return sortRVideos(result);
}

async function setVideoNav(){
  const videoId = getVideoId(window.location.search);

  try {
    const video = await getVideo(videoId);
    const res = await getVideos();

    if (!Array.isArray(res) || res.length < 8){ console.error('videoPage.js/setVideoNav error'); return; }

    const sortedRVideos = await getSortedRVideos(res.slice(0, 10), video.tags);

    for (let rVideo of sortedRVideos){
      renderRVideo(rVideo);
    }
  }catch (e){
    axiosErrorHandler(e);
  }
}

function setVideoPageTopbar(){
  window.addEventListener('load', (e) => {
    $('.navBar')[0].style.display = 'none';

    $('button[aria-label="Menu"]').click((e) => {
      $('.navBar').animate({ width: 'toggle' }, 200);
    });
  });
}

$(document).ready(async () => {
  setVideoPageTopbar();
  await setVideoMain();
  await setVideoNav();
});