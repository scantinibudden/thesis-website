
const { mongoose, allowCORS } = require('../db');

const ExperimentModel = require('../models/ExperimentModel');

module.exports = async (req, res) => {
  try {
    allowCORS(req, res, () => { });

    const { userId, trialNumber, wordID, meaningID, word, context, answers, wordOrder, lastTrialSubmitted, startTime, submitTime } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log(req.body)
    let user = await ExperimentModel.findOne({ userId: userId });
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.lastTrialSubmitted = lastTrialSubmitted;

    user.trials.push({
      trialNumber: trialNumber,
      wordID: wordID,
      meaningID: meaningID,
      word: word,
      context: context,
      answers: answers,
      wordOrder: wordOrder,
      startTime: startTime,
      submitTime: submitTime
    });

    await user.save();
    res.json(user);

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).send('Server Error');
    }
  }
}