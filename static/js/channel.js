function getChannelId(urlSearch){
    const hos = urlSearch.slice(1).split('&').filter(v => v.startsWith('ch_id'));
    return hos[0].split('=')[1];
}

// 채널 정보 요청 api
async function getChannel(chId) {
    if (!/^[0-9]+$/.test(chId)) {
        console.error('Invalid channelId');
        return;
    }

    try {
        const response = await axios.get(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${parseInt(chId, 10)}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch channel info:', error);
    }
}

//채널 영상 목록 요청 ㅁpi
async function getChannelVideos(chId) {
    if (!/^[0-9]+$/.test(chId)) {
        console.error('Invalid channelId');
        return;
    }

    try {
        const response = await axios.get(`http://techfree-oreumi-api.kro.kr:5000/video/getChannelVideoList?channel_id=${parseInt(chId, 10)}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch channel videos:', error);
    }
}

//채널 정보 표시
function setChannelInfo(chInfo) {
    if (!chInfo) return;

    $('.channel-cover img').attr('src', chInfo.channel_banner);
    $('.channel-name').text(chInfo.channel_name);
    $('.channel-profile').attr('src', chInfo.channel_profile);
    $('.channel-subscribers').text(`${nFormatter(chInfo.subscribers, 1)} subscribers`);
}

//메인 비디오 섹션 2
function setMainVideo(video) {
    const videoSection = document.querySelector('.smal-video');

    const html = `
        <div class="video-img">
          <div class="video-box">
            <video class="video-player mainvideo-player"
               src="https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4"
               poster="${video.thumbnail}"
               muted
               preload="metadata"></video>
        <span class="running-time">00:00</span>
      </div>
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


    const videoEl = videoSection.querySelector('.mainvideo-player');
    const timespan = videoSection.querySelector('.running-time');

    videoEl.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(videoEl.duration / 60);
        const seconds = Math.floor(videoEl.duration % 60).toString().padStart(2, '0');
        timespan.textContent = `${minutes}:${seconds}`;
    });
    // hover 재생
    videoEl.addEventListener("mouseenter", () => {
    videoEl.setAttribute("controls", "");
    videoEl.play();
  });

    videoEl.addEventListener("mouseleave", () => {
      videoEl.pause();
      videoEl.currentTime = 0;
      videoEl.removeAttribute("controls");
      videoEl.load(); // 썸네일 다시 보이기
  });
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
            const videoUrl = `https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4`; //비디오 불러오는링크 변수
            
            const videoHTML = `
                <div class="video-card">
                  <div class="video-box">
                    <video class="video-preview"
                           src="${videoUrl}"
                           poster="${video.thumbnail}"
                           muted
                           preload="metadata"></video>
                    <span class="running-time">00:00</span>
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="channel-name">${chName}</p>
                        <p class="video-meta">${nFormatter(video.views, 1)} views · ${moment(video.created_dt).fromNow()}</p>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforeend', videoHTML);
        });
        //hover 기능 연결
        const videoElements = container.querySelectorAll('.video-preview');

        videoElements.forEach((video) => {
            const timeSpan = video.parentElement.querySelector('.running-time');

            video.addEventListener('loadedmetadata' , () => {
                const minutes = Math.floor(video.duration / 60);
                const seconds = Math.floor(video.duration % 60).toString().padStart(2 , '0');
                if (timeSpan) timeSpan.textContent = `${minutes}:${seconds}`;
            });
            
            video.addEventListener("mouseenter", () => {
                video.setAttribute("controls", ""); // 컨트롤 보이기
                video.play();
            });
            video.addEventListener("mouseleave", () => {
                video.pause();
                video.currentTime = 0;
                video.removeAttribute("controls"); // 컨트롤 숨기기
                video.load(); // 썸네일 다시 보이기
            });
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
        const channelInfo = await getChannel(chId);
        const channelVideos = await getChannelVideos(chId);

        setChannelInfo(channelInfo);

        if (channelVideos.length > 0) {
            setMainVideo(channelVideos[0]);
        }
        
        setChannelVideos(channelVideos, channelInfo.channel_name);
    } catch (error) {
        console.error('Error setting channel page:', error);
    }
}