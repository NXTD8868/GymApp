import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not set');

const client = new MongoClient(uri);

// Connect once when the module is first imported
await client.connect();
console.log('Connected to MongoDB');

export const db = client.db('gym_app'); 
export { client };