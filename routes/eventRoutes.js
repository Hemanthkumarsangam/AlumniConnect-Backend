const express = require('express');
const Events = require('../models/eventModel');
const eventApp = express.Router();
const axios = require('axios');

eventApp.patch('/updateEventStatus', async (req, res, next) => {
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
  } catch (error) {
    res.status(500).send({ message: 'Failed to update events', error });
  }
  next()
});

eventApp.post('/addEvent', async (req, res) => {
const { title, description, hostName, eventType, date, time} = req.body;
  try {
    const response = await axios.get(process.env.CONFERENCE_ROOM_URI);
    const roomIdMatch = response.data.match(/const ROOM_ID = "([^"]+)"/); 
    if (!roomIdMatch) {
      return res.send({ message: 'Failed to retrieve ROOM_ID from API' });
    }
    const status = 'upcoming';
    const sessionId = roomIdMatch[1]; 
    const event = new Events({
      type: eventType, hostName, title, scheduledAt: date, period: time, status, sessionId, description,
    });
    const result = await event.save();
    /* addEventToCalender({
      summary : type,
      description,
      start : {dateTime : scheduledAt, timeZone : 'Asia/Kolkata'},
      end : {dateTime : new Date(startTime.getTime() + event.period * 60000), timeZone : 'Asia/Kolkata'}
    })*/
    res.send({ message: 'Event added successfully', result });
  } catch (error) {
      res.send({ message: 'Failed to add the event', error });
      console.log(error)
  }
})

eventApp.patch('/closeEvent/:id', async (req, res) => {
  const id = req.params.id
  await Events.findByIdAndUpdate(id, {status : `past`})
  res.send({message : `event closed successfully`})
})

eventApp.get('/getEvents', async (req, res) => {
  const events = await Events.find()
  res.send(events)
})

module.exports = eventApp