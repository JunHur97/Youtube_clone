const { Schema, model } = require('mongoose');

const tagPairSchema = new Schema({
  srcWord: {
    type: String,
    required: true,
  },
  destWord: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  }
});

module.exports = model('TagPair', tagPairSchema);