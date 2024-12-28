const express = require('express');
const offEventApp = express.Router();
const OffEvents = require('../models/offeventModel');

offEventApp.get('/getOffEvents', async (req, res) => {
    try {
        const offEvents = await OffEvents.find()
        res.send(offEvents)
    } catch (error) {
        console.log(error)
    }
})

offEventApp.post('/addOffEvent', async (req, res) => {
    const {title, mode, description, date, coordinators, venue} = req.body
    const offEvent = new OffEvents({
        title,mode,description,date,coordinators,venue
    })
    try {
        const savedOffEvent = await offEvent.save()
        res.send({message : "Event successfully added", events})
    } catch (error) {
        console.log(error)
    }
})

module.exports = offEventApp;