import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import { Lesson } from '../types/lesson.type';

const db = getFirestore();

import * as path from 'path';
import { randomUUID } from 'crypto';

const lessonsPath = path.resolve(__dirname, '../data/lessons.json');
const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf-8'));

export async function seedLessonsIfEmpty() {
  const snapshot = await db.collection('lessons').limit(1).get();

  if (!snapshot.empty) {
    console.log('Lessons already seeded. Skipping...');
    return;
  }

  const batch = db.batch();
  const timestamp = new Date().toISOString();

  lessons.forEach((lesson: Lesson) => {
    const id = randomUUID();
    const docRef = db.collection('lessons').doc(id);
    batch.set(docRef, {
      ...lesson,
      id,
      createdAt: timestamp,
    });
  });

  await batch.commit();
  console.log(`Seeded ${lessons.length} lessons to Firestore`);
}
