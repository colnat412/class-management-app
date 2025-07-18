import twilio from '';
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const sendSMS = (to: string, code: string) => {
  return client.messages.create({
    body: `Your login code is ${code}`,
    from: process.env.TWILIO_PHONE,
    to,
  });
};
