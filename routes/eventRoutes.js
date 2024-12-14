const express = require('express');
const Events = require('../models/eventModel');
const eventApp = express.Router();
const axios = require('axios');
const addEventToCalender = require('../calender');

eventApp.post('/addEvent', async (req, res) => {
const { type, hostName, scheduledAt, period, status, description } = req.body;
  try {
    const response = await axios.get(process.env.CONFERENCE_ROOM_URI);
    const roomIdMatch = response.data.match(/const ROOM_ID = "([^"]+)"/); 
    if (!roomIdMatch) {
      return res.send({ message: 'Failed to retrieve ROOM_ID from API' });
    }
    const sessionId = roomIdMatch[1]; 
    const event = new Events({
      type, hostName, scheduledAt, period, status, sessionId, description,
    });
    const result = await event.save();
    const startTime = new Date(event.scheduledAt);
    /* addEventToCalender({
      summary : type,
      description,
      start : {dateTime : scheduledAt, timeZone : 'Asia/Kolkata'},
      end : {dateTime : new Date(startTime.getTime() + event.period * 60000), timeZone : 'Asia/Kolkata'}
    })*/
    res.send({ message: 'Event added successfully', result });
  } catch (error) {
      res.send({ message: 'Failed to add the event', error });
  }
})

eventApp.patch('/closeEvent/:id', async (req, res) => {
  const id = req.params.id
  await Events.findByIdAndUpdate(id, {status : `past`})
  res.send({message : `event closed successfully`})
})

eventApp.patch('/updateEventStatus', async (req, res) => {
  try {
    const currentTime = new Date();
    const events = await Events.find();
    const updates = events.map(async (event) => {
      const startTime = new Date(event.scheduledAt);
      const endTime = new Date(startTime.getTime() + event.period * 60000);
      if (currentTime >= startTime && currentTime <= endTime) {
        if (event.status !== 'active') {
          event.status = 'active';
          await event.save();
        }
      } else if (currentTime > endTime) {
        if (event.status !== 'past') {
          event.status = 'past';
          await event.save();
        }
      }
    });
    await Promise.all(updates);
    res.send({ message: 'Event statuses updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to update event statuses', error });
  }
});

eventApp.get('/getEvents/:id', async (req, res) => {
  const status = req.params.id;
  const result = await Events.find({status})
  res.send({result})
})
  

module.exports = eventApp