import { getVideos, getChannel } from "./modules/axiosReq.js";

dayjs.extend(dayjs_plugin_relativeTime); // 경과시간 계산을 위한 플러그인 활성화

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
function handleMouseLeave(video) {
  video.pause();
  video.currentTime = 0; // 비디오 초기화
  video.removeAttribute("controls"); // 컨트롤러 감추기
  video.load(); // 포스터 이미지 다시 보여주기
}

function registerHoverEvents() {
  const videos = document.querySelectorAll(".video-player");

  videos.forEach((video) => {
    video.addEventListener("mouseenter", () => handleMouseEnter(video));
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

// 재생시간 형식 구하기
function formatDuration (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 재생시간 설정
function setRunningTime(videos) {
  videos.forEach((video) => {
    // 비디오 메타데이터가 로드되면 재생 시간 설정
    if (video.readyState >= 1) {
      const runningTimeSpan = video.parentElement.querySelector(".running-time");
      if(runningTimeSpan) {
        runningTimeSpan.textContent = formatDuration(video.duration);
      }
    } else {
      video.addEventListener("loadedmetadata", () => {
        const runningTimeSpan = video.parentElement.querySelector(".running-time");
        if(runningTimeSpan) {
          runningTimeSpan.textContent = formatDuration(video.duration);
        }
      });
    }
  });
}

// 메인 페이지 비디오 로드 함수
async function loadMainPageVideos() {
  try {
    // 비디오 데이터 가져오기
    const videos  = await getVideos();
    const section = document.querySelector(".video-section");
    
    // 섹션 초기화
    section.innerHTML = "";
    
    // 각 비디오에 대한 HTML 생성 및 추가
    for (const video of videos) {
      const timeAgo = dayjs(video.created_dt).fromNow();
      const channel  = await getChannel(video.channel_id);
      
      // HTML 템플릿 생성
      const videoHTML = createVideoHTML(video, channel, timeAgo);
      section.insertAdjacentHTML("beforeend", videoHTML);
    }
    
    // 비디오 요소에 이벤트 및 기능 추가
    const videoPlayers = document.querySelectorAll(".video-player");
    setRunningTime(videoPlayers);
    registerHoverEvents();
    moveTargetLink();
      
  } catch (error) {
    console.error("영상 목록을 불러오는 데 실패했습니다:", error);
  }
}

/**
 * 비디오 카드의 HTML을 생성하는 함수
 */
function createVideoHTML(video, channel, timeAgo) {
  return `
    <article class="video-grid" data-tags="${video.tags.join(",")}">
      <a class="move-video" href="#" data-video-id="${video.id}">
        <div class="video-content">
          <div class="video-box">
            <video class="video-player" src="https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4" muted preload="metadata" poster="${video.thumbnail}" ></video>
            <span class="running-time">00:00</span>
          </div>
      </a>
        <div class="video-details">
          <a class="move-channel" href="#" data-channel-id=${channel.id}>
            <img class="channel_profile " src="${channel.channel_profile}" alt="userProfile" />
          </a>
          <div class="video-meta">
            <a class="move-video" href="#" data-video-id="${video.id}">
              <h3 class="video-title">${video.title}</h3>
            </a>
            <a class="move-channel" href="#" data-channel-id=${channel.id}>
              <div class="channel-name ">${channel.channel_name}</div>
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
}

// 페이지 로드 시 비디오 로드 함수 실행
loadMainPageVideos();

export { getVideos, filterVideosByTag };