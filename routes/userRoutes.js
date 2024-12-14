const express = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/userModel');
const userApp = express.Router();

userApp.post('/signup', async (req, res) => {
  const {name, pass, email, regId} = req.body
  const role = req.body.role || 'Student'
  const existingUser = await User.findOne({email})
  if(existingUser !== null){
    res.send({message : `User already exists Try Logging in`})
    return;
  }
  const password = await bcryptjs.hash(pass, 10)
  const user = new User({
    name, password, email, regId, role
  })
  try {
    const result = await user.save();
    res.send({message : `User Created successfully`, result });
  } catch (err) {
    res.send({message : `Error creating user: ${err}`});
  }
})

userApp.put('/login', async (req, res) => {
  const {email, pass} = req.body;
  const user = await User.findOne({email})
  if(user === null){
    res.send({message : `User not found try SignUp again`})
    return;
  }
  if(await bcryptjs.compare(pass, user.password)){
    const role = user.role;
    res.send({email, role, message: `Successfull`})
    return
  }
  res.send({message : `Invalid password`})
})

userApp.patch('/changePass', async (req, res) => {
  const {email, pass, newPass} = req.body;
  const user = await User.findOne({email})
  if(user === null){
    res.send({message : `User not found try SignUp again`})
    return;
  }
  if(await bcryptjs.compare(pass, user.password)){
    const password = await bcryptjs.hash(newPass, 10);
    await User.findOneAndUpdate(
        {email},
        {password},
        {new : true}
    )
    res.send({message : 'Password changed successfully'})
    return
  }
  res.send({message : `Invalid password`})
})

userApp.patch('/changeRole', async (req, res) => {
    const {yearId} = req.body;
    await User.updateMany(
        {regId : {$regex : `^${yearId}`}},
        {$set : {role : ''}}
    )
})

userApp.get('/profile/:email', async (req, res) => {
  const email = req.params.email
  const result = await User.findOne({email})
  res.send(result)
})

module.exports = userApp;