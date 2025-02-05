const express = require('express');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const User = require('../models/userModel');
const userApp = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require('multer')
const path = require('path')
const fs = require('fs')

dotenv.config()

const authorizationUrl = process.env.LINKEDIN_AUTH_URL;
const tokenUrl = process.env.LINKEDIN_TOKEN_URL;
const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
const state = process.env.LINKEDIN_STATE;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

userApp.get('/signinWithGoogle', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(url);
});

userApp.get('/gcallback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Authorization code is missing.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });
    const userInfo = await oauth2.userinfo.get();
    const frontendRedirectUri = `${process.env.FRONTEND_URL}/signup`;
    const token = jwt.sign(
      { name: userInfo.data.name, email: userInfo.data.email, imageUrl: userInfo.data.picture},
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    const user = await User.findOne({email : userInfo.data.email})
    user === null ? res.redirect(`${frontendRedirectUri}?user=new&id=${token}`) : res.redirect(`${frontendRedirectUri}?user=old&id=${token}&role=${user.role}&email=${user.email}&_id=${user._id}`);
  } catch (error) {
    console.error('Error during Google OAuth process:', error);
    res.status(500).send('Authentication failed.');
  }
});

userApp.get('/signinWithLinkedIn', (req, res) => {
  const authUrl = `${authorizationUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=openid%20profile%20email`;
  res.redirect(authUrl);
});

userApp.get('/lcallback', async (req, res) => {
  const { code, state: returnedState } = req.query;
  if (returnedState !== state) {
    return res.status(400).send('State mismatch, possible CSRF attack');
  }

  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { access_token } = response.data;
    const userInfo = await axios.get(`${process.env.LINKEDIN_USERINFO_URL}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const frontendRedirectUri = `${process.env.FRONTEND_URL}/signup`;
    const token = jwt.sign(
      { name: userInfo.data.name, email: userInfo.data.email, imageUrl: userInfo.data.picture},
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    const user = await User.findOne({email : userInfo.data.email})
    user === null ? res.redirect(`${frontendRedirectUri}?user=new&id=${token}`) : res.redirect(`${frontendRedirectUri}?user=old&id=${token}&role=${user.role}&email=${user.email}&uid=${user._id}`);
  } catch (error) {
    console.error('Error getting access token or user data', error);
    res.status(500).send('Internal Server Error');
  }
});

userApp.post('/signup', async (req, res) => {
  const {name, email, username, pass, regId, role, imageUrl, yop, branch, company, designation, skills, about} = req.body
  const password = await bcryptjs.hash(pass, 10)
  const user = new User({
    name, email, username, password, regId, role, imageUrl, yop, branch, company, designation, skills, about
  })
  try {
    const result = await user.save();
    res.send({message : `User Created successfully`, result });
  } catch (err) {
    res.send({message : `Error creating user: ${err}`});
  }
})

userApp.put('/login', async (req, res) => {
  const {email, pass} = req.body;0
  const user = await User.findOne({email})
  if(user === null){
    res.send({message : `User not found try SignUp again`})
    return;
  }
  if(await bcryptjs.compare(pass, user.password)){
    res.send({name : user.name, role : user.role, message: `Successfull`})
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

userApp.patch('/checkUsername', async (req, res) => {
  const {username} = req.body
  const result = await User.findOne({username})
  if(result === null){
    res.send({message : 'valid'})
  }else{
    res.send({message : 'username already choosen'})
  }
})

userApp.post('/verifyToken', async (req, res) => {
  const token = req.body.token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ name: decoded.name, email: decoded.email, imageUrl: decoded.imageUrl});
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).send('Unauthorized');
  }
})

const storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, 'profilepics/')
  },
  filename : (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const uname = req.body.uname || 'nonamefound'
    cb(null, `${uname}${ext}`);
  }
})

const upload = multer({ storage })

userApp.post('/profilepicUpload', upload.single('file'), async (req, res) => {
  const ext = path.extname(req.file.originalname);  
  const uname = req.body.uname || 'nonamefound';  
  const newFilename = `${uname}${ext}`; 
  const oldPath = path.join('profilepics', req.file.filename); 
  const newPath = path.join('profilepics', newFilename);
  fs.rename(oldPath, newPath, ()=>{})
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${newFilename}`;
  res.send({ imageUrl });
})

userApp.get('/getUsers', async (req, res) => {
  const users = await User.find()
  res.send({users})
})

userApp.patch('/updateProfile', async (req, res) => {
  const {_id, name, email, regId, designation, company, branch, yop} = req.body
  try {
    await User.findByIdAndUpdate(
      {_id},
      {name, regId, email, company, designation, branch, yop},
      {new : true}
    )
    res.send({message : 'Profile updated successfully'})
  } catch (error) {
    res.send({message : 'Email already exists'})
  }
})

module.exports = userApp;