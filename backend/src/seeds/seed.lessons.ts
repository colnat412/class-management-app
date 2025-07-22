import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

const lessons = [
  {
    id: crypto.randomUUID(),
    title: 'Data Structures and Algorithms',
    description: 'Learn about various data structures and algorithms.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Introduction to Machine Learning',
    description:
      'Learn about the basics of machine learning and its applications.',
  },
];

export async function seedLessonsIfEmpty() {
  const snapshot = await db.collection('lessons').limit(1).get();

  if (!snapshot.empty) {
    console.log('Lessons already seeded. Skipping...');
    return;
  }

  const batch = db.batch();
  const timestamp = new Date().toISOString();

  lessons.forEach((lesson) => {
    const docRef = db.collection('lessons').doc(lesson.id);
    batch.set(docRef, {
      ...lesson,
      createdAt: timestamp,
    });
  });

  await batch.commit();
  console.log(`Seeded ${lessons.length} lessons to Firestore`);
}
