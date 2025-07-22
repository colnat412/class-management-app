import { sendEmailCode } from './email';
import { db } from '../firebase/firebase';
import { generateOTP } from '../utils/generateCode';

export const signIn = async (email: string) => {
  const code = generateOTP();
  const html = `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 400px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #2d7ff9; margin-bottom: 16px;">Sign in to Class Management App</h2>
        <p style="font-size: 16px; color: #333;">Your login code is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #2d7ff9; letter-spacing: 4px; margin: 16px 0;">
            ${code}
        </div>
        <p style="font-size: 14px; color: #888;">Please don't share this code with anyone.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #bbb;">If you didn't request this code, please ignore this email.</p>
    </div>
`;

  try {
    await db
      .collection('accessCodes')
      .doc(email)
      .set({
        code,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
    await sendEmailCode(email, code, html);
    return { success: true, message: 'Code sent to your email' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send code' };
  }
};

export const verifyCode = async (email: string, code: string) => {
  const accessCodeDoc = await db.collection('accessCodes').doc(email).get();
  try {
    if (!accessCodeDoc.exists) {
      throw new Error('No code found for this email');
    }
    if (accessCodeDoc.data()?.code !== code) {
      return { success: false, message: 'Invalid code' };
    }
    if (Date.now() > accessCodeDoc.data()?.expiresAt) {
      return { success: false, message: 'Code expired' };
    }

    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', email).get();

    let userData;
    if (!userQuery.empty) {
      const userDoc = userQuery.docs[0];
      await userDoc.ref.update({ verified: true });
      userData = (await userDoc.ref.get()).data();
    } else {
      const uuid = crypto.randomUUID();
      const newUserRef = usersRef.doc();
      await newUserRef.set({
        id: uuid,
        name: 'Unknown',
        email,
        phone: '',
        address: '',
        role: 'student',
        status: 'Active',
        lessons: [],
        createdAt: new Date().toISOString(),
        verified: true,
      });
      userData = (await newUserRef.get()).data();
    }

    await db.collection('accessCodes').doc(email).delete();
    return {
      success: true,
      message: 'Code verified successfully',
      data: userData,
    };
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, message: 'Verification failed' };
  }
};
