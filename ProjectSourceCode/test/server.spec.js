const request = require('supertest');
const { app, db } = require('../src/index')

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(app)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************

describe('Server page routes', () => {
	after(async () => {
		await db.end();
	});

	it('GET / returns home page', async () => {
		const res = await request(app).get('/');
		expect(res.status).to.equal(200);
		expect(res.text).to.include('Chip Ledger');
	});

	it('GET /login returns login page', async () => {
		const res = await request(app).get('/login');
		expect(res.status).to.equal(200);
		expect(res.text).to.include('Login');
	});

	it('GET /register returns register page', async () => {
		const res = await request(app).get('/register');
		expect(res.status).to.equal(200);
		expect(res.text).to.include('Register');
	});
});
