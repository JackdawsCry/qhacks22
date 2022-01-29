exports.handler = function (context, event, callback) {
    const message = `You have a new voicemail from ${event.From}. They said "${event.TranscriptionText}". \n Audio: ${event.RecordingUrl}`;

    const client = context.getTwilioClient();
    client.messages.create({
        to: context.MOBILE_NUMBER,
        from: context.TWILIO_NUMBER,
        body: message
    }).then(() => {
        callback();
    })
}; 