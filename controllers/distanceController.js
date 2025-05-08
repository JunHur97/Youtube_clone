const distanceService = require('../services/distanceService');

module.exports = {
  readAll: async (req, res, next) => {
    const { tags1, tags2 } = req.query;

    try {
      const tagPairs = await distanceService.readAll([tags1, tags2]);
  
      res.status(200).json({
        tagPairs,
      });
    }catch (e){
      console.error(e);

      res.status(500).json({
        msg: 'Interval Server Error'
      });
    }
  },
};

// (a1-a2 + b1-b2 + c1-c2 + a1-b2 + b1-c2 + c1-a2 + a1-c2 + b1-a2 + c1-b2) / 9
// (3*a1 - 3*a2 + 3*b1 - 3*b2 + 3*c1 - 3*c2) / 9
// (a1+b1+c1 - (a2+b2+c2)) / 3
// (a1+b1+c1)/3 - (a2+b2+c2)/3
// >> toAvg