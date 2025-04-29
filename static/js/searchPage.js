$(document).ready(function() {
  console.log('Search Page Loaded');

  let allVideos = [];
  let filteredVideos = [];

  function fetchAndStoreVideos() {
    fetch('http://techfree-oreumi-api.kro.kr:5000/video/getVideoList')
      .then(res => res.json())
      .then(data => {
        console.log('받아온 비디오 데이터:', data);
        allVideos = data;
        filteredVideos = [...allVideos];

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');
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
      filteredVideos = allVideos.filter(video =>
        (video.title && video.title.toLowerCase().includes(lowerTerm)) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(lowerTerm)))
      );
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
      const safeTags = Array.isArray(video.tags) ? video.tags.join(', ') : '';  // 추가
      const videoItem = $(`
        <div style="margin-bottom: 20px; color: white;">
          <img src="${video.thumbnail}" alt="썸네일" style="width: 300px;">
          <h3>${video.title}</h3>
          <p>${video.views} views</p>
          <p>Tags: ${tags}</p>
        </div>
      `);
      videoList.append(videoItem);
    });
  }

  fetchAndStoreVideos();

  $('#SearchForm').submit(function(e) {
    e.preventDefault();
    const searchTerm = $('#Search').val().trim();
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
