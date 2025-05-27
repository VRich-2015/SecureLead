// Manages and exports a reusable, promise-based MongoDB client. It's used by API routes like /api/leads to connect to my database.
// Prevents creating a new database connection on API requests...Uses the MONGODB_URI stored in my .env.local file.
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Pulls the MongoDB URI from environment variables

// If no URI is set, server is stopped and error is thrown
if (!uri) {
  throw new Error('Missing MONGODB_URI in .env.local');
}

let client;  // Will hold the MongoClient instance
let clientPromise;  // Will hold the promise of the connected client

if (process.env.NODE_ENV === 'development') {
  // Reuse the client in development to avoid hot reload problems
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect(); // Globally save promise... Ensures just one connection is reused across reloads
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri); // In production, create a new client instance and connect
  clientPromise = client.connect();
}

// Export the promise so other files can "await" connected client
export default clientPromise;
