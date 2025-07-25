import { assign } from 'nodemailer/lib/shared';
import { db } from '../firebase/firebase';
import { AssignLessonRequest } from '../types/lesson.type';
import { Timestamp } from 'firebase-admin/firestore';

export const getLessons = async () => {
  try {
    const lessonsSnapshot = await db.collection('lessons').get();
    const lessons = lessonsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return { success: false, error: 'Could not fetch lessons' };
  }
};

export const addLesson = async (title: string, description: string) => {
  const id = crypto.randomUUID();
  try {
    const newLessonRef = await db.collection('lessons').doc(id).set({
      id,
      title,
      description,
    });
    return {
      success: true,
      data: newLessonRef,
      message: 'Lesson added successfully',
    };
  } catch (error) {
    console.error('Error adding lesson:', error);
    return { success: false, error: 'Could not add lesson' };
  }
};

export const updateLesson = async (
  id: string,
  title?: string,
  description?: string
) => {
  try {
    await db.collection('lessons').doc(id).update({
      title,
      description,
    });
    return { success: true, message: 'Lesson updated successfully' };
  } catch (error) {
    console.error('Error updating lesson:', error);
    return { success: false, error: 'Could not update lesson' };
  }
};

export const deleteLesson = async (id: string) => {
  try {
    await db.collection('lessons').doc(id).delete();
    return { success: true, message: 'Lesson deleted successfully' };
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return { success: false, error: 'Could not delete lesson' };
  }
};

export const assignLessonToStudent = async (data: AssignLessonRequest) => {
  try {
    const { lessonId, studentIds } = data;

    if (!lessonId || !studentIds || !Array.isArray(studentIds)) {
      return { success: false, error: 'Invalid lesson ID or student IDs' };
    }

    const lessonSnap = await db.collection('lessons').doc(lessonId).get();
    if (!lessonSnap.exists) {
      return { success: false, error: 'Lesson not found' };
    }

    const batch = db.batch();

    studentIds.forEach((id) => {
      const assignmentRef = db
        .collection('users')
        .doc(id)
        .collection('assignedLessons')
        .doc(lessonId);

      batch.set(assignmentRef, {
        status: 'Pending',
        assignedAt: Timestamp.now(),
        completedAt: null,
      });
    });

    await batch.commit();

    return {
      success: true,
      message: 'Lesson assigned to students successfully',
    };
  } catch (error) {
    console.error('Error assigning lesson to student:', error);
    return { success: false, error: 'Could not assign lesson to student' };
  }
};

export const getAssignedLessons = async (studentId: string) => {
  try {
    const assignedLessonsSnapshot = await db
      .collection('users')
      .doc(studentId)
      .collection('assignedLessons')
      .get();

    const assignedLessons = assignedLessonsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (assignedLessons.length === 0) {
      return { success: false, error: 'No assigned lessons found' };
    }
    const assignedLessonDetails = await Promise.all(
      assignedLessons.map(async (lesson) => {
        const lessonSnap = await db.collection('lessons').doc(lesson.id).get();
        return {
          ...lesson,
          lessonDetails: lessonSnap.exists ? lessonSnap.data() : null,
        };
      })
    );

    return { success: true, data: assignedLessonDetails };
  } catch (error) {
    console.error('Error fetching assigned lessons:', error);
    return { success: false, error: 'Could not fetch assigned lessons' };
  }
};
