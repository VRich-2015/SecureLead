// This route simulates enriching a lead with additional data like location, phone number, social profiles, and notes. 
// It returns mock data and is meant to demonstrate how enrichment might work in a real-world app.
// Originally, I planned to use a third party API like Clearbit but it is no longer free. 
// This application can be swapped with a real API in the future by replacing the mock logic with a third-party API call.

// Handles POST requests to /api/enrich
export async function POST(request) {
  try {
    // Parse the incoming JSON body 
    const { name } = await request.json();
    console.log('Enrich API received request for:', name);

    // Validate that name is provided and is a string
    if (!name || typeof name !== 'string') {
      console.warn('Invalid or missing name field');
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    // Simulate enrichment process for demo purposes
    const mockData = {
      phone: '123-456-7890',
      location: 'Tampa, FL',
      socials: [
        `https://facebook.com/${name.replace(/\s+/g, '').toLowerCase()}`,
        `https://linkedin.com/in/${name.replace(/\s+/g, '').toLowerCase()}`
      ],
      notes: 'Verified client with strong buying intent.', // Example note
    };

    // Returns additional mock details for lead
    console.log(' Enrichment mock data sent for:', name);
    return Response.json(mockData);
  } catch (error) {
    console.error('Enrich API error:', error); // Catch and report errors
    return Response.json({ error: 'Failed to enrich lead' }, { status: 500 });
  }
}
