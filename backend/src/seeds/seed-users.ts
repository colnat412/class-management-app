import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

const users = [
  {
    name: 'Nguyen Tan Loc',
    email: 'nguyentanloc041203@gmail.com',
    phone: '+84362447457',
    role: 'instructor',
    status: 'Inactive',
    verified: false,
  },
  {
    name: 'Phung Anh Minh',
    email: 'phunganhminh@gmail.com',
    phone: '+84903334444',
    role: 'student',
    status: 'Inactive',
    verified: false,
  },
];

export async function seedUsersIfEmpty() {
  const snapshot = await db.collection('users').limit(1).get();

  if (!snapshot.empty) {
    console.log('Users already seeded. Skipping...');
    return;
  }

  const batch = db.batch();
  const timestamp = new Date().toISOString();

  users.forEach((user) => {
    const docRef = db.collection('users').doc(user.email);
    batch.set(docRef, {
      ...user,
      createdAt: timestamp,
    });
  });

  await batch.commit();
  console.log(`Seeded ${users.length} users to Firestore`);
}
