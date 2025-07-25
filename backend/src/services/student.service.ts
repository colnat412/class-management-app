import { db } from '../firebase/firebase';
import { User } from '../types/user.type';
import { generateOTP } from '../utils/generateCode';
import { sendEmailCode } from './email';

export const addStudent = async (
  name: string,
  email: string,
  phone: string
) => {
  try {
    const uuid = crypto.randomUUID();
    const studentRef = db.collection('users').doc(uuid);
    const studentDoc = await studentRef.get();

    if (studentDoc.exists) {
      return { success: false, message: 'Student already exists' };
    }
    const code = generateOTP();
    await studentRef.set({
      id: uuid,
      name,
      email,
      phone,
      address: '',
      role: 'student',
      status: 'Inactive',
      lessons: [],
      createdAt: new Date().toISOString(),
      verified: false,
    });
    const html = `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 400px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #2d7ff9; margin-bottom: 16px;">You have been joined to Class Management App</h2>
      <p style="font-size: 16px; color: #333;">Your login code is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #2d7ff9; letter-spacing: 4px; margin: 16px 0; text-align: center;">
      ${code}
      </div>
      <a href="http://localhost:3000/verify?email=${encodeURIComponent(
        email
      )}" style="text-decoration: none;">
      <button style="background: #2d7ff9; color: #fff; border: none; padding: 12px 24px; border-radius: 4px; font-size: 16px; cursor: pointer;">
      Verify your account
      </button>
      </a>
      <p style="font-size: 14px; color: #888;">Please don't share this code with anyone.</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #bbb;">If you didn't request this code, please ignore this email.</p>
    </div>
    `;

    await db
      .collection('accessCodes')
      .doc(uuid)
      .set({
        code,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
    await sendEmailCode(email, code, html);

    return { success: true, message: 'Student added successfully' };
  } catch (error) {
    console.error('Error adding student:', error);
    return { success: false };
  }
};

export const getStudents = async () => {
  try {
    const snapshot = await db
      .collection('users')
      .where('role', '==', 'student')
      .get();
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: students };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { success: false, data: [] };
  }
};

export const getStudentByEmail = async (email: string) => {
  try {
    const snapshot = await db.collection('users').doc(email).get();
    if (snapshot.exists) {
      return { success: true, data: snapshot.data() };
    } else {
      return { success: false, message: 'Student not found' };
    }
  } catch (error) {
    console.error('Error fetching student by email:', error);
    return { success: false, message: 'Failed to fetch student' };
  }
};

export const updateStudent = async (
  id: string,
  email: string,
  name: string,
  phone: string
) => {
  try {
    const studentRef = db.collection('users').doc(id);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return { success: false, message: 'Student not found' };
    }

    await studentRef.update({
      email,
      name,
      phone,
    });

    return { success: true, message: 'Student updated successfully' };
  } catch (error) {
    console.error('Error updating student:', error);
    return { success: false, message: 'Failed to update student' };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    await db.collection('users').doc(id).delete();
    return { success: true, message: 'Student deleted successfully' };
  } catch (error) {
    console.error('Error deleting student:', error);
    return { success: false, message: 'Failed to delete student' };
  }
};

export const searchStudents = async (query: string) => {
  try {
    const snapshot = await db
      .collection('users')
      .where('role', '==', 'student')
      .get();
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];

    const filteredStudents = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase())
    );

    return { success: true, data: filteredStudents };
  } catch (error) {
    console.error('Error searching students:', error);
    return { success: false, data: [] };
  }
};
