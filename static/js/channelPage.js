function getChannelId(urlSearch){
    const hos = urlSearch.slice(1).split('&').filter(v => v.startsWith('ch_id'));
    return hos[0].split('=')[1];
}

async function getChannel(chId){
    if (!/^[0-9]+$/.test(chId)){
        console.error('Invalid channelId');
        return;
    }

    const cachedData = getDataFromCache(`channel_${chId}`);
    if (!!cachedData) return JSON.parse(cachedData);

    const { data } = await axios.get(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${parseInt(chId, 10)}`);
    if (!!data) insertDataInCache(`channel_${chId}`, JSON.stringify(data));

    return data;
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
    $('.channel-subscribers')[0].innerText = `${nFormatter(chInfo.subscribers, 1)} subscribers`;
}

function setChannelVideos(chVideos, chName){
    chVideos.forEach((v) => {
        const video = `
            <div class="video-card">
                <a href="/videos?video_id=${v.id}">
                    <img src="${v.thumbnail}" alt="Video Thumbnail">
                </a>
                <div class="video-info">
                    <a href="/videos?video_id=${v.id}">
                        <h3 class="video-title">${v.title}</h3>
                    </a>
                    <p class="channel-name">${chName}</p>
                    <p class="video-meta">${nFormatter(v.views, 1)} views · ${moment(v.created_dt).fromNow()}</p>
                </div>
            </div>`;

        // 현재 playlist 1, 2가 같은 className을 공유하고 있는데, 추후 기능에 따른 분류 필요
        $('.playlist-videos')[0].insertAdjacentHTML('beforeend', video);
    });
}

function setSubBtn(chId){
    const subBtn = $('.channel-title > button.subscribe-button')[0];
    const subList = JSON.parse(getDataFromCache('subList'));

    subBtn.setAttribute('chId', chId);
    if (subList.includes(parseInt(chId, 10))){
        subBtn.setAttribute('subscribed', '');
        subBtn.innerText = 'SUBSCRIBED';
    }
}

function setSubBtnOnClick(){
    const subBtn = $('.channel-title > button.subscribe-button')[0];

    // subscribe.js/onSubBtnClick()
    subBtn.addEventListener('click', onSubBtnClick);
}

async function setChannelPage(){
    const chId = getChannelId(window.location.search);

    try {
        const res = await getChannel(chId);
        const { data: videosRes } = await getChannelVideos(chId);

        setChannelInfo(res);
        setSubBtn(chId);
        setSubBtnOnClick();
        // 일단 playlist에 5개만 보여주기 위함
        setChannelVideos(videosRes.slice(0, 5), res.channel_name);
        setChannelVideoLink();
    }catch (e){
        console.error(e);
    }
}