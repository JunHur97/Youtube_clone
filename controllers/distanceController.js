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