function getChannelId(urlSearch){
    const hos = urlSearch.slice(1).split('&').filter(v => v.startsWith('ch_id'));
    return hos[0].split('=')[1];
}

async function getChannel(channelId){
    if (!/^[0-9]+$/.test(channelId)){
        console.error('Invalid channelId');
        return;
    }

    return await axios.get(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${parseInt(channelId, 10)}`);
}

async function getChannelVideos(channelId){
    if (!/^[0-9]+$/.test(channelId)){
        console.error('Invalid channelId');
        return;
    }

    return await axios.get(`http://techfree-oreumi-api.kro.kr:5000/video/getChannelVideoList?channel_id=${parseInt(channelId, 10)}`);
}

function setChannelInfo(channelInfo){
    $('.channel-cover img')[0].src = channelInfo.channel_banner;
    $('.channel-name')[0].innerText = channelInfo.channel_name;
    $('.channel-profile')[0].src = channelInfo.channel_profile;
    $('.channel-subscribers')[0].innerText = `${nFormatter(channelInfo.subscribers, 1)} views`;
}

async function setChannelPage(){
    const chId = getChannelId(window.location.search);

    try {
        const { data: res } = await getChannel(chId);

        setChannelInfo(res);
    }catch (e){
        console.error(e);
    }
}