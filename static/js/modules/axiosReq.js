import { getDataFromCache, insertDataInCache } from '../localCache.js';

const baseUrl = 'http://techfree-oreumi-api.kro.kr:5000';

/**
 * 
 * @param {string} videoId 
 * @returns 
 */
async function getVideo(videoId){
  if (!/^[0-9]+$/.test(videoId)){
    console.error('Invalid videoId');
    return;
  }

  const cachedData = getDataFromCache(`video_${videoId}`);
  if (!!cachedData) return JSON.parse(cachedData);

  const { data } = await axios.get(`${baseUrl}/video/getVideoInfo?video_id=${parseInt(videoId, 10)}`);
  if (!!data) insertDataInCache(`video_${videoId}`, JSON.stringify(data));

  return data;
}

/**
 * 
 * @param {string|number} channelId 
 * @returns 
 */
async function getChannel(channelId){
  if (!/^[0-9]+$/.test(channelId)){
    console.error('Invalid channelId');
    return;
  }

  const cachedData = getDataFromCache(`channel_${channelId}`);
  if (!!cachedData) return JSON.parse(cachedData);

  const { data } = await axios.get(`${baseUrl}/channel/getChannelInfo?id=${parseInt(channelId, 10)}`);
  if (!!data) insertDataInCache(`channel_${channelId}`, JSON.stringify(data));

  return data;
}

async function getVideos(){
  const { data } = await axios.get(`${baseUrl}/video/getVideoList`);

  return data;
}

/**
 * 
 * @param {string} chId 
 * @returns 
 */
async function getChannelVideos(chId){
  if (!/^[0-9]+$/.test(chId)){
    console.error('Invalid channelId');
    return;
  }

  const { data } = await axios.get(`${baseUrl}/video/getChannelVideoList?channel_id=${parseInt(chId, 10)}`);

  return data;
}

export { getVideo, getChannel, getVideos, getChannelVideos, };