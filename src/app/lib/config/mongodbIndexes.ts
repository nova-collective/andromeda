import type { MongoClient } from 'mongodb';

let indexesInitialized: Promise<void> | null = null;

/**
 * Ensure application-wide MongoDB indexes are created.
 *
 * This helper runs once per application lifecycle and is invoked
 * during the initial database connection. Subsequent calls reuse
 * the same promise so concurrent requests do not trigger duplicate
 * index creation.
 */
export function ensureMongoIndexes(client: MongoClient): Promise<void> {
  if (!indexesInitialized) {
    indexesInitialized = (async () => {
      const db = client.db('andromeda');
      await Promise.all([
        db.collection('users').createIndexes([
          { key: { email: 1 }, unique: true, name: 'users_email_unique' },
          { key: { username: 1 }, unique: true, name: 'users_username_unique' },
        ]),
      ]);
    })();
  }

  return indexesInitialized;
}
