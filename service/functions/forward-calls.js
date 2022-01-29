exports.handler = function (context, event, callback) {
    // Forward to mobile
    const twiml = new Twilio.twiml.VoiceResponse();
    const moment = require('moment');
    const { google } = require('googleapis');

    const calendar = google.calendar({
        version: 'v3',
        auth: context.GOOGLE_API_KEY
    });

    calendar.freebusy.query({
        resource: {
            timeMin: moment().toISOString(),
            timeMax: moment().add(10, 'minutes').toISOString(),
            items: [{ id: context.GOOGLE_CALENDAR_ID }]
        }
    }).then((results) => {
        let { busy } = results.data.calendars[context.GOOGLE_CALENDAR_ID];
        if (busy.length !== 0) {
            twiml.say('Sorry, I am unavailable right now.');
            twiml.say('Please leave a message for me.');
            twiml.record({
                timeout: 10,
                transcribe: true,
                transcribeCallback: '/voicemail'
            })
            callback(null, twiml);
        } else {
            twiml.dial(context.MOBILE_NUMBER);
            callback(null, twiml);
        }
    })
};