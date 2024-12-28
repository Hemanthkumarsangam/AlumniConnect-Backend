const express = require('express');
const jobApp = express.Router();
const Jobs = require('../models/jobsModel');

jobApp.use(async (req, res, next) => {
    const date = new Date();
    await Jobs.deleteMany({applyBefore: {$lt: date}})
    next()
})

jobApp.get('/getJobs', async (req, res) => {
    const jobs = await Jobs.find()
    res.send({jobs})
})

jobApp.post('/addJob', async (req, res) => {
    const job = new Jobs(req.body)
    await job.save()
    res.send({message : 'Job added successfully'})
})

module.exports = jobApp;