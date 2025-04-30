$(document).ready(function () {
  console.log('Search Page Loaded');

  let allVideos = [];
  let filteredVideos = [];

  function fetchAndStoreVideos() {
    fetch('http://techfree-oreumi-api.kro.kr:5000/video/getVideoList')
      .then(res => res.json())
      .then(data => {
        console.log('받아온 비디오 데이터:', data);
        allVideos = data;
        console.log('allVideos 내부 데이터:', allVideos);
        filteredVideos = [...allVideos];

        console.log('샘플 타이틀과 태그 확인');
        allVideos.slice(0, 5).forEach(v => {
          console.log('제목:', v.title);
          console.log('태그:', v.tags);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('search');
        if (query) {
          performSearch(query);
        } else {
          drawList(filteredVideos);
        }
      })
      .catch(error => console.error('비디오 로드 실패:', error));
  }

  function performSearch(searchTerm) {
    if (!searchTerm) {
      filteredVideos = [...allVideos];
    } else {
      const lowerTerm = searchTerm.toLowerCase();

      filteredVideos = allVideos.filter(video => {
        const titleMatch = video.title?.toLowerCase().includes(lowerTerm);
        const tagList = Array.isArray(video.tags)
          ? video.tags
          : (typeof video.tags === 'string' ? video.tags.split(',') : []);
          const tagMatch = tagList.some(tag => tag.toLowerCase().includes(lowerTerm));

          return titleMatch || tagMatch;
      });
    }

    console.log(`검색 결과: ${filteredVideos.length}개`);
    drawList(filteredVideos);
  }

  function drawList(results) {
    const videoList = $('#Video-Container');
    videoList.empty();

    if (!results.length) {
      videoList.text('No videos found.');
      return;
    }

    results.forEach(video => {
      const safeTags = Array.isArray(video.tags) ? video.tags.join(', ') : '';
      const hasChannelImg = video.channelThumbnail ? `<img src="${video.channelThumbnail}" alt="채널 썸네일">` : '';

      const videoItem = $(`
        <div class="video-grid" data-tags="${safeTags}">
          <div class="video-content">
            <div class="video-box">
              <img class="video-player" src="${video.thumbnail}" alt="썸네일">
              <span class="running-time">${video.runningTime || '00:00'}</span>
            </div>
            <div class="video-details">
              ${hasChannelImg}
              <div class="video-meta">
                <div class="video-title">${video.title}</div>
                <div class="channel-name">${video.channelName || '알 수 없음'}</div>
                <div class="video-info">
                  <div>${video.views} views</div>
                  <div class="time-ago">${video.uploadDate || ''}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);

      videoList.append(videoItem);
    });
  }

  window.filterVideosByTag = function (tag) {
    const videoItems = $('#Video-Container').children('div');
    videoItems.each(function () {
      const tags = $(this).data('tags') ? $(this).data('tags').split(',').map(t => t.trim()) : [];
      if (tag === 'All' || tags.includes(tag)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  };

  fetchAndStoreVideos();

  $('#searchForm').submit(function (e) {
    e.preventDefault();
    const searchTerm = $('#search').val().trim();
    const url = new URL(window.location.href);
    if (searchTerm) {
      url.searchParams.set('query', searchTerm);
    } else {
      url.searchParams.delete('query');
    }
    window.history.pushState({}, '', url);
    performSearch(searchTerm);
  });
});
