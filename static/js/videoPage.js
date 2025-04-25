async function getUser(videoId){
    if (!/^[0-9]+$/.test(videoId)){
        console.error('Invalid videoId');
        return;
    }

    return await axios.get(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${parseInt(videoId, 10)}`);
}

async function getChannel(channelId){
    if (!/^[0-9]+$/.test(channelId)){
        console.error('Invalid channelId');
        return;
    }

    return await axios.get(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${parseInt(channelId, 10)}`);
}

function getVideoId(urlSearch){
    const hos = urlSearch.slice(1).split('&').filter(v => v.startsWith('video_id'));
    return hos[0].split('=')[1];
}

async function getVideos(){
    return await axios.get('http://techfree-oreumi-api.kro.kr:5000/video/getVideoList');
}

function setVideoInfo(videoInfo){
    $('.videoPlayer')[0].src = `https://storage.googleapis.com/youtube-clone-video/${videoInfo.id}.mp4`;
    $('.videoMetadata .title')[0].textContent = videoInfo.title;
    $('.videoMetadata .uploadDate')[0].textContent = moment(videoInfo.created_dt).format('MMM D, YYYY');
    $('.videoMetadata .views')[0].textContent = `${nFormatter(videoInfo.views, 1)} views`;
    $('.videoMetadata .dislikes p')[0].innerText = nFormatter(videoInfo.dislikes, 1);
    $('.videoMetadata .likes p')[0].innerText = nFormatter(videoInfo.likes, 1);
};

function setChannelInfo(channelInfo){
    $('.videoUploader img')[0].src = channelInfo.channel_profile;
    $('.uploaderInfo .uploaderName')[0].innerText = channelInfo.channel_name;
    $('.uploaderInfo .uploaderSubscribers')[0].innerText = `${nFormatter(channelInfo.subscribers, 1)} subscribers`;
};

function setDocumentTitle(title){
    document.title = title;
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
        console.error(e);
    }
}

async function setVideoNav(){
    try {
        const { data: res } = await getVideos();

        res.forEach(async (v) => {
            const { data: chRes } = await getChannel(v.channel_id);
            const comment = `
            <div class="rVideo">
                <a href="/video?video_id=${v.id}">
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
        console.error(e);
    }
}