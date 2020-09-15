const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Car = require('../lib/models/car');

describe('LAB-03-PostgresSQL-Models routes', () => {
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    await Promise.all([
      Car.insert({
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        color: 'red'
      }),
      Car.insert({
        make: 'Ford',
        model: 'Mustang',
        year: 1967,
        color: 'black'
      }),
      Car.insert({
        make: 'Chevrolet',
        model: 'Nova',
        year: 1969,
        color: 'blue'
      })
    ]);
  });
  it('creates a new car by POST', async() => {
    const response = await request(app)
      .post('/api/v1/cars')
      .send({ make:'Datsun', model:'280Z', year:1976, color: 'red' });
    
    expect(response.body).toEqual({
      id: expect.any(String),
      make:'Datsun', 
      model:'280Z', 
      year:1976,
      color: 'red'
    });
  });

  it('returns a list of cars', async() => {
    const response = await request(app)
      .get('/api/v1/cars');
    
    expect(response.body).toEqual(expect.arrayContaining([
      { id: expect.any(String), make: 'Toyota', model: 'Camry', year: 2019, color: 'red' },
      { id: expect.any(String), make: 'Ford', model: 'Mustang', year: 1967, color: 'black' },
      { id:expect.any(String), make: 'Chevrolet', model: 'Nova', year: 1969, color: 'blue' }
    ]));
  });
  
  it('finds a car by id', async() => {
    const cars = await Car.find();
    const car = cars[0];
    const foundCar = await request(app)
      .get(`/api/v1/cars/${car.id}`);
    expect(foundCar.body).toEqual(car);
  });

  it('returns a not found message if the car is not found', async() => {
    const id = 123456;
    const foundCar = await request(app)
      .get(`/api/v1/cars/${id}`);
    expect(foundCar.body).toEqual({ error: 'The item was not found' });
  });
  it('updates a car', async() => {
    const cars = await Car.find();
    const car = cars[1];
    const updatedCar = {
      ...car,
      color: 'Fire Engine Red'
    };
    const returnedCar = await request(app)
      .put(`/api/v1/cars/${car.id}`)
      .send(updatedCar);
    expect(returnedCar.body).toEqual(updatedCar);
  });

});
