// This route simulates enriching a lead with additional data like location, phone number, social profiles, etc. 
// It returns mock data and is meant to demonstrate how enrichment might work in a real-world app.
// Originally, I planned to use a third party API like Clearbit but it is no longer free. 
// This application can be swapped with a real API in the future by replacing the mock logic with a third-party API call.

// Handles POST requests to /api/enrich
export async function POST(request) {
  try {
    // Parse the incoming JSON body 
  const { name, email } = await request.json();
  console.log('Enrich API received request for:', name, email);

// Validate input provided
 if (!name || !email) {
      return Response.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
// Simulate enrichment process for demo purposes
   const mockData = {
      phone: '123-456-7890',
      employment: 'Software Developer at Nova WorldWide',
      socials: [
        `https://facebook.com/${name.replace(/\s+/g, '').toLowerCase()}`,
        `https://linkedin.com/in/${name.replace(/\s+/g, '').toLowerCase()}`
      ],
      notes: 'Verified client with strong buying intent.',
    };
    
// Returns additional mock details for lead
   console.log('Enrichment mock data sent for:', name);
    return Response.json(mockData);
  } catch (error) {
    console.error(' Enrich API error:', error);
    return Response.json({ error: 'Failed to enrich lead' }, { status: 500 });
  }
}
