import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const twilioService = {
  async makeCall(phoneNumber, callbackUrl) {
    try {
      const call = await client.calls.create({
        url: callbackUrl,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        statusCallback: `${process.env.BASE_URL}/api/calls/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST'
      });
      
      return call.sid;
    } catch (error) {
      console.error('Twilio call error:', error);
      throw new Error('Failed to initiate call');
    }
  },

  async sendFollowUpSMS(phoneNumber, message) {
    try {
      await client.messages.create({
        body: message,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw new Error('Failed to send follow-up SMS');
    }
  }
};