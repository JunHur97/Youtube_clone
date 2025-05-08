function normalize_for_search(str) {
  return str
  .normalize("NFD")
  .replace(/\s+/g, " ") 
  .toLowerCase()
  .trim()
  .replace(/[\u0300-\u036f]/g, "");
}

class SearchPage {
  constructor(containerSelector, formSelector) {
    this.videoContainer = $(containerSelector);
    this.searchForm = $(formSelector);
    this.allVideos = [];
    this.filteredVideos = [];
  }

  // 페이지 초기화
  init() {
    console.log("Search Page Loaded");
    this.bindEvents();
    this.fetchAndStoreVideos();
  }

  // 이벤트 바인딩
  bindEvents() {
    this.searchForm.on("submit", (e) => {
      e.preventDefault();
      const searchTerm = $("#search").val().trim();
      console.log("검색어 확인:", searchTerm);

      const url = new URL(window.location.href);
      if (searchTerm) {
        url.searchParams.set("search", searchTerm);
      } else {
        url.searchParams.delete("search");
      }
      window.history.pushState({}, "", url);
      this.performSearch(searchTerm);
    });
  }

  // API에서 비디오 데이터 가져오기
  fetchAndStoreVideos() {
    fetch("http://techfree-oreumi-api.kro.kr:5000/video/getVideoList")
      .then((res) => res.json())
      .then((data) => {
        console.log("받아온 비디오 데이터:", data);
        this.allVideos = data;
        this.filteredVideos = [...this.allVideos];

        const urlParams = new URLSearchParams(window.location.search);
        const query = decodeURIComponent(urlParams.get("search"));
        if (query) {
          this.performSearch(query);
        } else {
          this.drawList(this.filteredVideos);
        }
      })
      .catch((error) => console.error("비디오 로드 실패:", error));
  }

  // 검색 실행
  performSearch(searchTerm) {
    if (!searchTerm) {
      this.filteredVideos = [...this.allVideos];
    } else {
      const lowerTerm = normalize_for_search(searchTerm);

      this.allVideos.forEach((video) => {
        const normTitle = normalize_for_search(video.title);
        const normTags = Array.isArray(video.tags)
        ? video.tags.map(tag => normalize_for_search(tag))
        : [];
        console.log("영상 제목:", video.title);
        console.log("영상 태그:", video.tags);
      });

      this.filteredVideos = this.allVideos.filter((video) => {
        const titleMatch = normalize_for_search(video.title)?.includes(lowerTerm);

        const tagList = Array.isArray(video.tags)
          ? video.tags
          : typeof video.tags === "string"
          ? video.tags.split(",")
          : [];

        const tagMatch = tagList.some((tag) =>
          normalize_for_search(tag).includes(lowerTerm)
        );

        return titleMatch || tagMatch;
      });
    }

    console.log(`검색 결과: ${this.filteredVideos.length}개`);
    this.drawList(this.filteredVideos);
  }

  // ✅ 검색 결과 렌더링
  drawList(results) {
    this.videoContainer.empty();

    if (!results.length) {
      this.videoContainer.text("No videos found.");
      return;
    }

    results.forEach((video) => {
      const safeTags = Array.isArray(video.tags)
        ? video.tags.join(", ")
        : "";
      const hasChannelImg = video.channelThumbnail
        ? `<img src="${video.channelThumbnail}" alt="채널 썸네일">`
        : "";

      const videoItem = $(`
        <div class="video-grid" data-tags="${safeTags}">
          <div class="video-content">
            <div class="video-box">
              <img class="video-player" src="${video.thumbnail}" alt="썸네일">
              <span class="running-time">${video.runningTime || "00:00"}</span>
            </div>
            <div class="video-details">
              ${hasChannelImg}
              <div class="video-meta">
                <div class="video-title">${video.title}</div>
                <div class="channel-name">${video.channelName || "알 수 없음"}</div>
                <div class="video-info">
                  <div>${video.views} views</div>
                  <div class="time-ago">${video.uploadDate || ""}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);

      this.videoContainer.append(videoItem);
    });
  }

  // 태그로 필터링 (외부에서 호출 가능)
  filterVideosByTag(tag) {
    const videoItems = this.videoContainer.children("div");
    videoItems.each(function () {
      const tags = $(this)
        .data("tags")
        ?.split(",")
        .map((t) => t.trim()) || [];
      if (tag === "All" || tags.includes(tag)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
}

// 페이지 로드 시 실행
$(document).ready(() => {
  alert("jQuery DOM 준비됨"); //추가
  const searchPage = new SearchPage("#Video-Container", "#searchForm");
  searchPage.init();

  // 전역 함수로 태그 필터링
  window.filterVideosByTag = function (tag) {
    searchPage.filterVideosByTag(tag);
  };
});
