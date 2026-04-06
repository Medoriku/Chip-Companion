const request = require('supertest');
const { expect } = require('chai');
const { app, db } = require('../src/index');

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

	it('POST /logout redirects to home page (positive)', async () => {
		const res = await request(app).post('/logout');
		expect(res.status).to.equal(302);
		expect(res.headers.location).to.equal('/');
	});

	it('POST /login with missing password returns 400 (negative)', async () => {
		const res = await request(app).post('/login').send({ email: 'user@example.com' });
		expect(res.status).to.equal(400);
		expect(res.text).to.include('Missing email or password');
	});
});
