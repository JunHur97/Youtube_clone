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
      url.pathname = "/search";
      if (searchTerm) {
        url.searchParams.set("search", searchTerm);
      } else {
        url.searchParams.delete("search");
      }
      history.pushState({}, "", url);

    // 필터링 바로 실행
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
        const raw = urlParams.get("search");
        const query = raw ? decodeURIComponent(raw) : "";
        
        if (query && query.trim()) {
          this.performSearch(query); // 검색어 있으면 검색 실행
        } else {
          this.drawList(this.allVideos); // 검색어 없으면 전체 영상 표시
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

  // 검색 결과 렌더링
  drawList(results) {
    this.videoContainer.empty();

    if (!results.length) {
      this.videoContainer.text("No videos found.");
      return;
    }

    results.forEach((video) => {
      const safeTags = Array.isArray(video.tags) ? video.tags.join(", ") : "";
      const hasChannelImg = video.channelThumbnail
        ? `<img class="channel_profile" src="${video.channelThumbnail}" alt="채널 썸네일">`
        : "";

      const videoItem = $(`
        <div class="video-grid" data-tags="${safeTags}">
          <div class="video-content">
            <div class="video-box">
              <img class="video-player" src="${video.thumbnail}" alt="썸네일" />
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

  // 태그 필터링
  filterVideosByTag(tag) {
    const videoItems = this.videoContainer.children(".video-grid");
    videoItems.each(function () {
      const tags = $(this).data("tags")?.split(",").map((t) => t.trim()) || [];
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
  const searchPage = new SearchPage("#Video-Container", "#searchForm");
  searchPage.init();

  // 외부 호출을 위한 전역 등록
  window.filterVideosByTag = function (tag) {
    searchPage.filterVideosByTag(tag);
  };
});
