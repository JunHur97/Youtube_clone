import { getDataFromCache, insertDataInCache } from '../localCache.js';

async function getVideo(videoId){
    if (!/^[0-9]+$/.test(videoId)){
        console.error('Invalid videoId');
        return;
    }

    const cachedData = getDataFromCache(`video_${videoId}`);
    if (!!cachedData) return JSON.parse(cachedData);

    const { data } = await axios.get(`http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${parseInt(videoId, 10)}`);
    if (!!data) insertDataInCache(`video_${videoId}`, JSON.stringify(data));

    return data;
}

async function getChannel(channelId){
    if (!/^[0-9]+$/.test(channelId)){
        console.error('Invalid channelId');
        return;
    }

    const cachedData = getDataFromCache(`channel_${channelId}`);
    if (!!cachedData) return JSON.parse(cachedData);

    const { data } = await axios.get(`http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${parseInt(channelId, 10)}`);
    if (!!data) insertDataInCache(`channel_${channelId}`, JSON.stringify(data));

    return data;
}

async function getVideos(){
    const { data } = await axios.get('http://techfree-oreumi-api.kro.kr:5000/video/getVideoList');

    return data;
}

async function getChannelVideos(chId){
    if (!/^[0-9]+$/.test(chId)){
        console.error('Invalid channelId');
        return;
    }

    const { data } = await axios.get(`http://techfree-oreumi-api.kro.kr:5000/video/getChannelVideoList?channel_id=${parseInt(chId, 10)}`);

    return data;
}

export { getVideo, getChannel, getVideos, getChannelVideos, };