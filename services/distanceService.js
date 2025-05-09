const TagPair = require('../models/tagPair');

function checkValidTags(tags){
  const [tag1, tag2] = tags;

  if (!Array.isArray(tag1)) return false;
  if (!Array.isArray(tag2)) return false;

  if (tag1.length === 0) return false;
  if (tag2.length === 0) return false;

  return true;
}

module.exports = {
  readAll: async (tags) => {
    const tag1 = JSON.parse(tags[0]);
    const tag2 = JSON.parse(tags[1]);

    if (!checkValidTags([tag1, tag2])) return;

    const result = [];

    const tagPairs = await TagPair.find({
      $or: [{
        $and: [
          { srcWord: { $in: tag1, }, },
          { destWord: { $in: tag2, }, }
        ]}, {
        $and: [
          { srcWord: { $in: tag2, }, },
          { destWord: { $in: tag1, }, }
        ]}
      ],
    }, { _id: 0, __v: 0 }).lean();

    for (let tag of tag1){
      if (tag2.includes(tag)){
        result.push({ srcWord: tag, destWord: tag, distance: 1, });
      }
    }

    return [...result, ...tagPairs];
  },
};