const mongoose = require('mongoose');

const trialSchema = new mongoose.Schema({
    trialNumber: { type: Number, required: true },
    wordID: { type: Number, required: true },
    meaningID: { type: Number, required: true },
    word: { type: String, required: true },
    context: { type: String, required: true },
    answers: { type: [String], required: true },
    wordOrder: { type: [String], required: true },
    submitTime: { type: Date, required: true }
});

const expDBSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    loginTime: { type: Date, required: true },
    tutorialTime: { type: Date, required: false },
    trials: [trialSchema],
    lastTrialSubmitted: { type: Number, required: false }
    /*serieAssigned: { type: Number, required: false },*/
});


const ExperimentModel = mongoose.model('ExperimentModel', expDBSchema);

module.exports = ExperimentModel;
