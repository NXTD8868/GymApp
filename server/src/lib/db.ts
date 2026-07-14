import { MongoClient } from 'mongodb';
import { type WorkoutDocument } from '../typing/types.ts';
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not set');

const client = new MongoClient(uri, {
});

await client.connect();
console.log('Connected to MongoDB');

export const db = client.db('gym_app'); 
export const workouts = db.collection<WorkoutDocument>('workouts');

export { client };