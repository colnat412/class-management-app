import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import { User } from '../types/user.type';

const db = getFirestore();

import * as path from 'path';
import { randomUUID } from 'crypto';

const usersPath = path.resolve(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

export async function seedUsersIfEmpty() {
  const snapshot = await db.collection('users').limit(1).get();

  if (!snapshot.empty) {
    console.log('Users already seeded. Skipping...');
    return;
  }

  const batch = db.batch();
  const timestamp = new Date().toISOString();

  users.forEach((user: User) => {
    const id = randomUUID();
    const docRef = db.collection('users').doc(id);
    batch.set(docRef, {
      ...user,
      id,
      createdAt: timestamp,
    });
  });

  await batch.commit();
  console.log(`Seeded ${users.length} users to Firestore`);
}
