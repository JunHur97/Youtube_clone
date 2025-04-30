import { getVideo, getChannel, getVideos } from './modules/axiosReq.js';
import { onSubBtnClick } from './subscribe.js';
import { getDataFromCache } from './localCache.js';

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
    $('.uploaderInfo .uploaderName')[0].innerText = channelInfo.channel_name;
    $('.uploaderInfo .uploaderName')[0].href = `/channels?ch_id=${channelInfo.id}`;
    $('.uploaderInfo .uploaderSubscribers')[0].innerText = `${nFormatter(channelInfo.subscribers, 1)} subscribers`;

    setSubBtn(channelInfo.id);
};

function setDocumentTitle(title){
    document.title = title;
}

function setVideoKeyControl(){
    $(document).keypress((e) => {
        e.preventDefault();

        if (e.key === ' '){
            const video = $('.videoMain > .videoPlayer')[0];

            video.paused ? video.play() : video.pause();
        }
    });
}

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

async function setVideoMain(){
    const videoId = getVideoId(window.location.search);

    try {
        const { data: res } = await getUser(videoId);
        const { data: channelRes } = await getChannel(res.channel_id);

        setVideoInfo(res);
        setChannelInfo(channelRes);
        setDocumentTitle(res.title);
    }catch (e){
        axiosErrorHandler(e);
    }
}

async function setVideoNav(){
    try {
        const res = await getVideos();

        res.forEach(async (v) => {
            const { data: chRes } = await getChannel(v.channel_id);
            const comment = `
            <div class="rVideo">
                <a href="/videos?video_id=${v.id}">
                    <img src="${v.thumbnail}">
                </a>
                <div class="rVideoInfo">
                    <a class="rVideoTitle" href="/video?video_id=${v.id}">${v.title}</a>
                    <a class="rVideoUploader" href="#">${chRes.channel_name}</a>
                    <div class="rVideoBottom">
                        <p>${nFormatter(v.views, 1)} views</p>
                        <p>${moment(v.created_dt).fromNow()}</p>
                    </div>
                </div>
            </div>`;

            $('.videoNav')[0].insertAdjacentHTML('beforeend', comment);
        });
    }catch (e){
        axiosErrorHandler(e);
    }
}

function setVideoPageTopbar(){
    window.addEventListener('load', (e) => {
        $('.navBar')[0].style.display = 'none';

        $('button[aria-label="Menu"]').click((e) => {
            $('.navBar').animate({ width: 'toggle' }, 200);
        })
    });
}

$(document).ready(async () => {
    setVideoPageTopbar();
    await setVideoMain();
    await setVideoNav();
});