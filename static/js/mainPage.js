
  dayjs.extend(dayjs_plugin_relativeTime); // 경과시간 계산을 위한 플러그인 활성화

  const getVideoList = async () => {
    return await axios.get("http://techfree-oreumi-api.kro.kr:5000/video/getVideoList");
  }

  const getChannelInfo = async (channelId) => {
    // channelId 유효성 검사
    if (!/^[0-9]+$/.test(channelId)) {
      console.error('Invalid channelId');
      return;
    }

    return await axios.get(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${parseInt(channelId, 10)}`);
  }

  function moveTargetLink() {
    document.addEventListener("click", (e) => {
      // 가장 가까운 조상 요소(자기 자신 포함) 중에서 특정 셀렉터와 일치하는 요소 찾는 메서드
      const videoLink = e.target.closest(".move-video");
      const channelLink  = e.target.closest(".move-channel");
  
      // 클릭된 a태그의 dataset의 값을 가져온 뒤 해당 videoId를 사용해서 URL로 이동
      if (videoLink) {
        e.preventDefault();
        const videoId = videoLink.dataset.videoId;
        window.location.href = `/videos?video_id=${videoId}`;
      }

      if (channelLink) {
        e.preventDefault();
        const channelId = channelLink.dataset.channelId;
        window.location.href = `/channels?ch_id=${channelId}`;
      }
      });
  }

  // 비디오 재생
  function handleMouseEnter(video) {
    video.setAttribute("controls", ""); // 컨트롤러 보이기
    video.play();
  }

  // 비디오 멈춤
  function handleMouseLeave(video){
    video.pause();
    video.currentTime = 0; // 비디오 초기화
    video.removeAttribute("controls"); // 컨트롤러 감추기
    video.load(); // 포스터 이미지 다시 보여주기
  }

  function registerHoverEvents() {
    const videos = document.querySelectorAll(".video-player");

    videos.forEach((video) => {
      video.addEventListener("mouseenter", ()=> handleMouseEnter(video));
      video.addEventListener("mouseleave", () => handleMouseLeave(video));
    });
  }
  
  // tag별로 영상 보기
  function filterVideosByTag(tag) {
    const videos = document.querySelectorAll(".video-grid");

    videos.forEach((video) => {
      const tags = video.dataset.tags.split(",").map(t => t.trim()); // 공백 제거

      if(tag === "All" || tags.includes(tag)) {
        video.style.display = "block";
      } else {
        video.style.display = "none";
      }
    });
  }
  

  // 실제 video 데이터 처리
  (async () => {
    try {
      const { data: res } = await getVideoList();
      const section = document.querySelector(".video-section");

      section.innerHTML = ""; // section 태그 초기화

      for (const video of res) {
        const timeAgo = dayjs(video.created_dt).fromNow();
        const { data: channelRes } = await getChannelInfo(video.channel_id);

        const html = `
          <article class="video-grid" data-tags="${video.tags.join(",")}">
            <a class="move-video" href="#" data-video-id="${video.id}">
                <div class="video-content">
                  <div class="video-box">
                    <video class="video-player" src="https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4" muted preload="metadata" poster="${video.thumbnail}" ></video>
                    <span class="running-time">23:45</span>
                  </div>
            </a>
              <div class="video-details">
              <a class="move-channel" href="#" data-channel-id=${video.channel_id}>
                <img class="channel_profile " src="${channelRes.channel_profile}" alt="userProfile" />
              </a>
                <div class="video-meta">
                  <a class="move-video" href="#" data-video-id="${video.id}">
                    <h3 class="video-title">${video.title}</h3>
                  </a>
                  <a class="move-channel" href="#" data-channel-id=${video.channel_id}>
                    <div class="channel-name ">${channelRes.channel_name}</div>
                  </a>
                  <div class="video-info">
                    <div class="views">${nFormatter(video.views, 1)} views </div>
                    <div class="time-ago"> ${timeAgo} </div>
                  </div>
                </div>
              </div>
            </div>
            
          </article>
          `;
        section.insertAdjacentHTML("beforeend", html);
      };

        registerHoverEvents();
        moveTargetLink();
        
    } catch (error) {
      console.error("영상 목록을 불러오는 데 실패했습니다:", error);
    }
  })();

  export { getVideoList, filterVideosByTag };