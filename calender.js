const { google } = require('googleapis');  

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT);  
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });  

const addEventToCalender = (event) => {
    calendar.events.insert({  
    calendarId: 'primary',  
    resource: event,  
    }, (err, event) => {  
    if (err) {  
        return console.error('Error creating event:', err);  
    }  
    console.log('Event created:', event.data.htmlLink);  
    });
}



module.exports = addEventToCalender;