require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 4000;

const authorizationUrl = 'https://www.linkedin.com/oauth/v2/authorization';
const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
const state = process.env.LINKEDIN_STATE;

app.get('/login', (req, res) => {
    const authUrl = `${authorizationUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=openid%20profile%20email`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
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
        const userInfo = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        console.log(userInfo.data);
        res.json(userInfo.data);
    } catch (error) {
        console.error('Error getting access token or user data', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
