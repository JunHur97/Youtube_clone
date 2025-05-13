function normalize_for_search(str) {
  return str.toLowerCase().trim().replace(/[#\u0300-\u036f]/g, "");
}

class SearchPage {
  constructor(containerSelector, formSelector) {
    this.videoContainer = $(containerSelector);
    this.searchForm = $(formSelector);
    this.allVideos = [];
    this.filteredVideos = [];
  }

  init() {
    console.log("Search Page Loaded");
    this.bindEvents();
    this.fetchAndStoreVideos();
  }

  bindEvents() {
    this.searchForm.on("submit", (e) => {
      e.preventDefault();
      const searchTerm = $("#search").val().trim();
      const url = new URL(window.location.href);
      url.pathname = "/search";
      if (searchTerm) {
        url.searchParams.set("search", searchTerm);
      } else {
        url.searchParams.delete("search");
      }
      history.pushState({}, "", url);
      this.performSearch(searchTerm);
    });
  }

  async fetchAndStoreVideos() {
    try {
      const res = await fetch("https://www.techfree-oreumi-api.ai.kr/video/getVideoList");
      const data = await res.json();

      const videosWithChannel = await Promise.all(
        data.map(async (video) => {
          try {
            const channelRes = await fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${video.channel_id}`);
            const channelInfo = await channelRes.json();
            return { ...video, channel: channelInfo };
          } catch {
            return {
              ...video,
              channel: {
                channel_name: "Unknown",
                channel_profile: ""
              }
            };
          }
        })
      );

      this.allVideos = videosWithChannel;
      this.filteredVideos = [...this.allVideos];

      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("search") || "";
      if (query.trim()) {
        this.performSearch(query);
      }
    } catch (err) {
      console.error("비디오 로드 실패:", err);
    }
  }

  performSearch(searchTerm) {
    if (!searchTerm) {
      this.filteredVideos = [...this.allVideos];
    } else {
      const lowerTerm = normalize_for_search(searchTerm);
      this.filteredVideos = this.allVideos.filter((video) => {
        const titleMatch = normalize_for_search(video.title || "").includes(lowerTerm);
        const tagList = Array.isArray(video.tags)
          ? video.tags.map(t => t.trim())
          : typeof video.tags === "string"
            ? video.tags.split(",").map(t => t.trim())
            : [];
        const tagMatch = tagList.some(tag => normalize_for_search(tag).includes(lowerTerm));
        const channelMatch = normalize_for_search(video.channel.channel_name || "").includes(lowerTerm);

        return titleMatch || tagMatch || channelMatch;
      });
    }

    console.log(`검색 결과: ${this.filteredVideos.length}개`);
    this.drawList(this.filteredVideos);
  }

  drawList(results) {
    this.videoContainer.empty();
    if (!results.length) {
      const noResultMessage = $("<p>")
        .text("검색 결과가 없습니다.")
        .css({
          color: "white",
          fontSize: "1.5rem",
          textAlign: "center",
          marginTop: "40px"
        });
      this.videoContainer.append(noResultMessage);
      return;
    }

    results.forEach((video) => {
      const safeTags = Array.isArray(video.tags) ? video.tags.join(", ") : "";
      const videoItem = $(`
        <div class="video-grid" data-tags="${safeTags}">
          <div class="video-content">
            <div class="video-box">
              <img class="video-player" src="${video.thumbnail}" alt="썸네일" />
              <span class="running-time">${video.runningTime || "00:00"}</span>
            </div>
            <div class="video-details">
              <img class="channel_profile" src="${video.channel.channel_profile}" alt="채널 썸네일" />
              <div class="video-meta">
                <div class="video-title">${video.title}</div>
                <div class="channel-name">${video.channel.channel_name}</div>
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

  filterVideosByTag(tag) {
    const videoItems = this.videoContainer.children(".video-grid");
    videoItems.each(function () {
      const tags = $(this).data("tags")?.split(",").map(t => t.trim()) || [];
      if (tag === "All" || tags.includes(tag)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
}

$(document).ready(() => {
  const searchPage = new SearchPage("#Video-Container", "#searchForm");
  searchPage.init();
  window.filterVideosByTag = function (tag) {
    searchPage.filterVideosByTag(tag);
  };
});
