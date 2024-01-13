
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error', err));

const allowCORS = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://experimentsd-web.vercel.app/'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
};
  
module.exports = { mongoose, allowCORS };
