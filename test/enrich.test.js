// This file tests the functionality and error handling of your /api/enrich endpoint using Mocha, Chai, and Supertest.
// Verifies POST /api/enrich route returns mock enrichment data wtih valid input is provided. The route returns an error when input is missing.

const request = require('supertest'); // Sends simulated HTTP requests to your server.
const { expect } = require('chai'); // Allows readable assertions like .to.equal() and .to.have.property().

const BASE_URL = 'http://localhost:3000'; // Updates if running on different port

// Groups all enrich endpoint tests under one heading for readability.
describe('Enrich API', () => {

// Test 1-Returns enrichment data for valid input... 
// Checks that HTTP status is 200 ok, location property exists in the response, and socials property is an array
  it('POST /api/enrich should return enrichment data for a valid lead', async () => {
    const leadData = {
      name: 'Sasha Fierce',
      email: 'sasha@example.com',
    };

    const res = await request(BASE_URL)
      .post('/api/enrich')
      .send(leadData)
      .set('Accept', 'application/json');

    console.log('POST /api/enrich Response:', res.body);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('location');
    expect(res.body).to.have.property('socials').that.is.an('array');
  });

  // Test 2- Returns error for missing input. Sends a POST request with an empty object. 
  //  Check that status code is 400 bad request and response contains error property
  it('POST /api/enrich should return 400 if name and email are missing', async () => {
    const res = await request(BASE_URL)
      .post('/api/enrich')
      .send({})
      .set('Accept', 'application/json');

  // Log response for debugging
    console.log('POST /api/enrich (missing data) Response:', res.body);
  // Aseertions confirm error handling
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});