import got from 'got';

import TagPair from '../models/tagPair.js';
import connect from '../connect.js';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = `http://techfree-oreumi-api.kro.kr:5000`;

/**
 * 
 * @param {Array<object>} videos 
 * @returns 
 */
const getTagSet = (videos) => {
  const result = new Set();

  videos.forEach((video) => {
    if (!Array.isArray(video.tags)) return null;

    video.tags.forEach((tag) => {
      result.add(tag);
    });
  });

  return result;
};

/**
 * 
 * @param {Set<string>} tagSet 
 * @returns {Array<Array<string, string>>}
 */
const getPair = (tagSet) => {
  const result = new Array();

  for (let i=0; i<tagSet.size; i++){
    const it = tagSet.keys();

    for (let j=0; j<i; j++){
      it.next();
    }

    const src = it.next().value;

    for (let v of it){
      result.push([src, v]);
    }
  }

  return result;
};

/**
 * Push distance between srcWord and destWord into pairs
 * @param {Array<Array<string, string>>} pairs 
 */
const getPairsDistance = async (pairs) => {
  const result = new Array();

  for (let pair of pairs){
    const pairDistance = await getDistance(pair);

    result.push([...pair, pairDistance]);
  }

  return result;
};

/**
 * 
 * @param {Array<string, string>} pair 
 * @returns {number}
 */
const getDistance = async (pair) => {
  const res = await TagPair.findOne({
    $or: [{
      srcWord: pair[0],
      destWord: pair[1],
    }, {
      srcWord: pair[1],
      destWord: pair[0],
    }]
  }, { distance: 1, _id: 0 }).lean();

  if (!!res) return res.distance;

  const response = await requestPairDistance(pair);
  const body = JSON.parse(response.body);

  if (body.result !== 0){
    console.error(body);
    return;
  }

  const { Distance } = body.return_object['WWN WordRelInfo'].WordRelInfo;

  await createTagPair([...pair, Distance]);

  return Distance;
};

const createTagPair = async (tagPair) => {
  await TagPair.create({
    srcWord: tagPair[0],
    destWord: tagPair[1],
    distance: tagPair[2],
  });
};

/**
 * 
 * @param {Array<string, string>} pair 
 * @returns {number}
 */
const requestPairDistance = async (pair) => {
  const url = 'http://aiopen.etri.re.kr:8000/WiseWWN/WordRel';
  const opt = {
    headers: {
      Authorization: process.env.ETRI_AIOPEN_API_KEY,
    },
    json: {
      "request_id": "reserved field",	
      "argument": {
        "first_word": pair[0],
        "second_word": pair[1],
      },
    },
  };

  const res = await got.post(url, opt);

  return res;
};

const init = async () => {
  const { body } = await got.get(`${baseUrl}/video/getVideoList`);
  const videos = JSON.parse(body);

  await connect();

  let tagSet;

  if (Array.isArray(videos))
    tagSet = getTagSet(videos);

  const pairs = getPair(tagSet);
  const result = await getPairsDistance(pairs);

  console.log(result);
};

(async () => {
  await init();
})();