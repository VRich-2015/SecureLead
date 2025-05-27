// RESTful API file
import clientPromise from '../../../lib/mongo'; // MongoDB connection
import { ObjectId } from 'mongodb'; // MongoDB ObjectID for update/delete

// GET /api/leads... Fetches all leads from MongoDB collection.
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('securelead');
    const leads = await db.collection('leads').find({}).toArray(); // Get all leads submitted
    return Response.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return Response.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads... Adds a new lead to the database... Name, email, phone number, and location required
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, location } = body;

    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('securelead');
    const newLead = { name, email, phone, location, createdAt: new Date() }; // Time stamp

    const result = await db.collection('leads').insertOne(newLead);
    return Response.json({ message: 'Lead created', leadId: result.insertedId });
  } catch (error) {
    console.error('Error creating lead:', error);
    return Response.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

// PUT /api/leads... Updates an existing lead... Id, name, email, phone, and location required
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, email, phone, location } = body;

    if (!id || !name || !email) {
      return Response.json({ error: 'ID, name, and email are required for update' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('securelead');

    const result = await db.collection('leads').updateOne(
      { _id: new ObjectId(id) }, // Find by id
      { $set: { name, email, phone, location } }
    );

    return Response.json({ message: 'Lead updated' });
  } catch (error) {
    console.error('Error updating lead:', error);
    return Response.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/leads?id=<lead_id... Deletes a lead by ID... Requires query param `id`
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Missing ID for deletion' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('securelead');

    const result = await db.collection('leads').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'No lead found with that ID' }, { status: 404 });
    }

    return Response.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return Response.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}