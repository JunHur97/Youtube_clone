const mongoose = require('mongoose');

const connect = async () => {
  const DBOpt = {
    autoIndex: false,
  };

  mongoose.connection.once('open', () => {
    console.log('DB connected');
  });

  try {
    await mongoose.connect(process.env.DB_URL, DBOpt);
  }catch (e){
    console.error('error while connect to DB', e);
  }
};

module.exports = connect;