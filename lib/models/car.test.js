const fs = require('fs');
const pool = require('../utils/pool');
const Car = require('./car');

describe('Car model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new car into the database', async() => {
    const newCar = await Car.insert({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'red'
    });
    const { rows } = await pool.query('SELECT * FROM cars WHERE id=$1', [newCar.id]);
    expect(newCar).toEqual(rows[0]);
  });
  
  it('finds a car by id', async() => {
    const newCar = await Car.insert({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'red'
    });
    const foundCar = await Car.findById(newCar.id);
    expect(foundCar).toEqual({
      id:newCar.id,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'red'
    });
  });
  it('returns null if the id is not in the database', async() => {
    const missingCar = await Car.findById(123456789);
    expect(missingCar).toBeNull();
  });
  it('finds all the cars in the database', async() => {
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
    const cars = await Car.find();
    expect(cars).toEqual(expect.arrayContaining([
      { id: expect.any(String), make: 'Toyota', model: 'Camry', year: 2019, color: 'red' },
      { id: expect.any(String), make: 'Ford', model: 'Mustang', year: 1967, color: 'black' },
      { id:expect.any(String), make: 'Chevrolet', model: 'Nova', year: 1969, color: 'blue' }
    ]));
  });
  it('updates records', async() => {
    const newCar = await Car.insert({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'red'
    });
    const paintedCar = await Car.update(newCar.id, {
      make:'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'green'
    });
    expect(paintedCar).toEqual({
      id:newCar.id,
      make:'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'green'
    });
  });
  it('deletes items', async() => {
    const newCar = await Car.insert({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'red'
    });
    const deletedCar = await Car.delete(newCar.id);
    expect(deletedCar).toEqual({
      id: newCar.id,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'red'
    });
    const foundCar = await Car.findById(newCar.id);
    expect(foundCar).toBeNull();
  });
});
