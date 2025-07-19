import { db } from '../firebase/firebase';
import { generateOTP } from '../utils/generateCode';
import { sendEmailCode } from './email';

export const addStudent = async (
  name: string,
  email: string,
  phone: string
) => {
  try {
    const studentRef = db.collection('students').doc(email);
    const studentDoc = await studentRef.get();

    if (studentDoc.exists) {
      throw new Error('Student already exists');
    }
    const code = generateOTP();
    await studentRef.set({
      name,
      email,
      phone,
      role: 'student',
      createdAt: new Date().toISOString(),
      verified: false,
    });

    const html = `
    <h3>Hello ${name}, your verification code is ${code}</h3>
    <p>You have been invited to join the Classroom Management App.</p>
    <p>Please click the link below to set up your account:</p>
    <a href="/" target="_blank" style="padding: 10px 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
      Set up Account
    </a>
  `;
    await sendEmailCode(email, code, html);

    return { success: true, message: 'Student added successfully' };
  } catch (error) {
    console.error('Error adding student:', error);
    return { success: false };
  }
};
