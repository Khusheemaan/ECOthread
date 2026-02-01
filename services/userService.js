import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'userProfile';
const COLLECTION_NAME = 'user';

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  }
  return db;
}

export async function registerUser(email, password, profile) {
  try {
    const database = await connectToDatabase();
    const users = database.collection(COLLECTION_NAME);

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser = {
      email,
      password, // Note: In production, hash the password!
      name: profile.name,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      dob: profile.dob || '',
      username: '',
      stylePreferences: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(newUser);
    newUser._id = result.insertedId;

    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function authenticateUser(email, password) {
  try {
    const database = await connectToDatabase();
    const users = database.collection(COLLECTION_NAME);

    const user = await users.findOne({ email, password });

    return user;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, profileUpdates) {
  try {
    const database = await connectToDatabase();
    const users = database.collection(COLLECTION_NAME);

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...profileUpdates,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return null;
    }

    // Return the updated user
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}
