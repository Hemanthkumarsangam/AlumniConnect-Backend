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
    const {title, coordinator, description, location, email, phone, date, from, to, activities} = req.body
    const feedback = "..."
    const highlights = []
    const coor = {
        name : coordinator,
        phone : phone,
        email : email
    }
    const time = `${from} - ${to}`
    const dateTime = new Date(date);
    const [hours, minutes] = to.split(":").map(Number);
    dateTime.setHours(hours, minutes, 0, 0);
    const offEvent = new OffEvents({
        title, description, date: dateTime, coordinator: coor, location, time, activities, feedback, highlights
    })
    try {
        const events = await offEvent.save()
        res.send({message : "Event successfully added", events})
    } catch (error) {
        console.log(error)
    }
})

module.exports = offEventApp;