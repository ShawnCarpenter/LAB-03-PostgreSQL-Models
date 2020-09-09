const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Car = require('../lib/models/car')

describe('LAB-03-PostgresSQL-Models routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  it('creates a new car by POST', async() => {
    const response = await request(app)
      .post('api/v1/cars')
      .send({ make:'Datsun', model:'280Z', year:1976, color: 'red' });
  });
});
