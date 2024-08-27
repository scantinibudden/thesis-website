
const { mongoose, allowCORS } = require('../db');
const ExperimentModel = require('../models/ExperimentModel');

module.exports = async (req, res) => {
  try {
    allowCORS(req, res, () => {});
    
    const {userId} = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

  const user = await ExperimentModel.findOne({userId: userId}
                        ).catch(err => { console.error('User not found');});
  
  res.json(user);
    
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).send('Server Error');
    }
  }
}
