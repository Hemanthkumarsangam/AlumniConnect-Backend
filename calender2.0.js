const { google } = require('googleapis');
const http = require('http');
const url = require('url');

// OAuth2 client setup
const CLIENT_ID = '633382576529-sa7025ketmto9cq9jbqp9qf17b37285o.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URIS = [
  'http://localhost:7000/authcallback',
];

// Scopes for Calendar access
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Function to create an OAuth2 client for each redirect URI
const createOAuthClient = (redirectUri) => {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);
};

// Create servers for each redirect URI
REDIRECT_URIS.forEach((redirectUri, index) => {
  const oauth2Client = createOAuthClient(redirectUri);
  const port = 7000; // Extract port from URI or default to 3000

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log(`Authorize this app by visiting (port ${port}):`, authUrl);

  http.createServer(async (req, res) => {
    if (req.url.startsWith('/authcallback')) {
      const query = new url.URL(req.url, `http://${req.headers.host}`).searchParams;
      const code = query.get('code');

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing authorization code.');
        return;
      }

      try {
        // Exchange the authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log(`Token acquired (port ${port}):`, tokens);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Authentication successful! You can close this window.');

        // Add an event
        addEvent(oauth2Client);
      } catch (error) {
        console.error(`Error retrieving access token (port ${port}):`, error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Authentication failed.');
      }
    }
  }).listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
});

// Function to add an event to Google Calendar
const addEvent = async (auth) => {
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: 'Test Event in India',
    location: 'Online',
    description: 'A test event added using Google Calendar API for Indian timezone.',
    start: {
      dateTime: '2024-12-20T10:00:00+05:30', // 10:00 AM IST
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: '2024-12-20T11:00:00+05:30', // 11:00 AM IST
      timeZone: 'Asia/Kolkata',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    console.log('Event created successfully:', response.data);
  } catch (error) {
    console.error('Error creating event:', error);
  }
};