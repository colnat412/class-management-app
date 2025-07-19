import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const sendSMS = (phone: string, code: string) => {
  console.log(`[DEBUG] Sending to: ${phone}`);

  return client.messages.create({
    body: `Your login code is ${code}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};
