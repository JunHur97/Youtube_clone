import { getChannel, getChannelVideos } from './modules/axiosReq.js';
import { onSubBtnClick } from './subscribe.js';
import { getDataFromCache } from './localCache.js';

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

//메인 비디오 섹션 2
function setMainVideo(video) {
    const videoSection = document.querySelector('.smal-video');

    const html = `
        <div class="video-img">
            <img src="${video.thumbnail}" alt="video thumbnail" class="video-thumbnail">
            <div class="videotitle">${video.title}</div>
            <img src="/public/img/channel/video controls.svg" alt="Video Controls" class="video-controls">
        </div>

        <div class="video-description">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">${nFormatter(video.views, 1)} views · ${moment(video.created_dt).fromNow()}</div>
            <div class="description">${video.description}</div>
        </div>
    `;

    videoSection.innerHTML = html;
}

//섹션 3 플레이리스트 구성 각각 5개 영상
function setChannelVideos(chVideos, chName) {
    if (!chVideos || chVideos.length === 0) return;

    const videos1 = chVideos.slice(0, 5);   // 플레이리스트 1
    const videos2 = chVideos.slice(5, 10);  // 플레이리스트 2

    const renderVideos = (videoList, containerSelector) => {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container ${containerSelector} not found.`);
            return;
        }

        container.innerHTML = ''; 

        videoList.forEach(video => {
            const videoHTML = `
                <div class="video-card">
                    <img src="${video.thumbnail}" alt="Video Thumbnail">
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="channel-name">${chName}</p>
                        <p class="video-meta">${nFormatter(video.views, 1)} views · ${moment(video.created_dt).fromNow()}</p>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforeend', videoHTML);
        });
    };

    renderVideos(videos1, '.playlist1-videos');
    renderVideos(videos2, '.playlist2-videos');
}

// 페이지 로딩시 채널 정보 및 영상 데이터 불러오는 세팅
async function setChannelPage() {
    const chId = getChannelId(window.location.search);

    if (!chId) {
        console.error('Channel Id not found in URL.');
        return;
    }

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