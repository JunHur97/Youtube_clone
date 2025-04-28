function getChannelId(urlSearch){
    const hos = urlSearch.slice(1).split('&').filter(v => v.startsWith('ch_id'));
    return hos[0].split('=')[1];
}

async function getChannel(chId){
    if (!/^[0-9]+$/.test(chId)){
        console.error('Invalid channelId');
        return;
    }

    return await axios.get(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${parseInt(chId, 10)}`);
}

async function getChannelVideos(chId){
    if (!/^[0-9]+$/.test(chId)){
        console.error('Invalid channelId');
        return;
    }

    return await axios.get(`http://techfree-oreumi-api.kro.kr:5000/video/getChannelVideoList?channel_id=${parseInt(chId, 10)}`);
}

function setChannelInfo(chInfo){
    $('.channel-cover img')[0].src = chInfo.channel_banner;
    $('.channel-name')[0].innerText = chInfo.channel_name;
    $('.channel-profile')[0].src = chInfo.channel_profile;
    $('.channel-subscribers')[0].innerText = `${nFormatter(chInfo.subscribers, 1)} views`;
}

function setChannelVideos(chVideos){
    chVideos.forEach((v) => {
        const video = `
            <div class="video-card">
                <img src="${v.thumbnail}" alt="Video Thumbnail">
                <div class="video-info">
                    <h3 class="video-title">${v.title}</h3>
                    <p class="channel-name">Marcus Levin</p>
                    <p class="video-meta">${nFormatter(v.views, 1)} views · ${moment(v.created_dt).fromNow()}</p>
                </div>
            </div>`;

        // 현재 playlist 1, 2가 같은 className을 공유하고 있는데, 추후 기능에 따른 분류 필요
        $('.playlist-videos')[0].insertAdjacentHTML('beforeend', video);
    });
}

async function setChannelPage(){
    const chId = getChannelId(window.location.search);

    try {
        const { data: res } = await getChannel(chId);
        const { data: videosRes } = await getChannelVideos(chId);

        setChannelInfo(res);
        // 일단 playlist에 5개만 보여주기 위함
        setChannelVideos(videosRes.slice(0, 5));
    }catch (e){
        console.error(e);
    }
}