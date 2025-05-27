// This file uses Mocha for test structure... Chai for assertions...and Supertest for simulating HTTP requests to your Next.js API.
// To validate the core GET and POST functionality of your /api/leads endpoint to ensure It fetches an array of existing leads It 
// successfully creates a new lead with valid input
const request = require('supertest'); // Allows developer to simulate HTTP requests without opening a browser.
const { expect } = require('chai'); // Used to write expressive assertions like expect(...).to.equal(...).

const BASE_URL = 'http://localhost:3000'; // Adjust if running on a different port

// Groups leads API tests under one heading
describe(' Leads API', () => {
  it('GET /api/leads should return an array of leads', async () => {
    const res = await request(BASE_URL).get('/api/leads');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('leads');
    expect(res.body.leads).to.be.an('array');
  });

  it('POST /api/leads should create a new lead', async () => {
  const newLead = {
    name: 'Test User',
    email: 'testuser@example.com',
    phone: '123-456-7890',
    location: 'Sample City',
  };
  
   const res = await request(BASE_URL)
    .post('/api/leads')
    .send(newLead)
    .set('Accept', 'application/json');
   
console.log('Lead Creation Response:', res.body);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('leadId');
  });
});
