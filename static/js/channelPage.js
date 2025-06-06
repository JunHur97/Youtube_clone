import { getChannel, getChannelVideos } from './modules/axiosReq.js';
import { onSubBtnClick } from './subscribe.js';
import { getDataFromCache } from './localCache.js';

/**
 * 
 * @param {string} urlSearch 
 * @returns 
 */
function getChannelId(urlSearch){
  const hos = urlSearch.slice(1).split('&').filter(v => v.startsWith('ch_id'));
  return hos[0].split('=')[1];
}

function setChannelInfo(chInfo){
  $('.channel-cover img')[0].src = chInfo.channel_banner;
  $('.channel-name')[0].innerText = chInfo.channel_name;
  $('.channel-profile')[0].src = chInfo.channel_profile;
  $('.channel-subscribers')[0].innerText = `${nFormatter(chInfo.subscribers, 1)} subscribers`;
}

/**
 * 
 * @param {Array<object>} chVideos 
 * @param {string} chName 
 */
function setChannelVideos(chVideos, chName){
  chVideos.forEach((v) => {
    const video = `
      <div class="video-card">
        <a href="/videos?video_id=${v.id}">
          <img src="${v.thumbnail}" alt="Video Thumbnail">
        </a>
        <div class="video-info">
          <a href="/videos?video_id=${v.id}">
            <h3 class="video-title">${v.title}</h3>
          </a>
          <p class="channel-name">${chName}</p>
          <p class="video-meta">${nFormatter(v.views, 1)} views · ${moment(v.created_dt).fromNow()}</p>
        </div>
      </div>`;

    // 현재 playlist 1, 2가 같은 className을 공유하고 있는데, 추후 기능에 따른 분류 필요
    $('.playlist-videos')[0].insertAdjacentHTML('beforeend', video);
  });
}

/**
 * 
 * @param {string} chId 
 */
function setSubBtn(chId){
  const subBtn = $('.channel-title > button.subscribe-button')[0];
  const subList = JSON.parse(getDataFromCache('subList'));

  subBtn.setAttribute('chId', chId);
  if (subList.includes(parseInt(chId, 10))){
    subBtn.setAttribute('subscribed', '');
    subBtn.innerText = 'SUBSCRIBED';
  }
}

function setSubBtnOnClick(){
  const subBtn = $('.channel-title > button.subscribe-button')[0];

  // subscribe.js/onSubBtnClick()
  subBtn.addEventListener('click', onSubBtnClick);
}

async function setChannelPage(){
  const chId = getChannelId(window.location.search);

  try {
    const res = await getChannel(chId);
    const videosRes = await getChannelVideos(chId);

    setChannelInfo(res);
    setSubBtn(chId);
    setSubBtnOnClick();
    // 일단 playlist에 5개만 보여주기 위함
    setChannelVideos(videosRes.slice(0, 5), res.channel_name);
  }catch (e){
    axiosErrorHandler(e);
  }
}

$(document).ready(async () => {
  await setChannelPage();
});
