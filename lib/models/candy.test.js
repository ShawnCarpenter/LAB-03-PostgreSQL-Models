const fs = require('fs');
const pool = require('../utils/pool');
const Candy = require('./candy');
describe('Candy Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert new candy into database', async() => {
    const newCandy = await Candy.insert({
      name: 'licorice',
      type: 'fruit',
      flavor: 'red'
    });
    const { rows } = await pool.query('SELECT * FROM candies WHERE id=$1', [newCandy.id]);
    expect(newCandy).toEqual(rows[0]);
  });
  it('find candy by id', async() => {
    const newCandy = await Candy.insert({
      name: 'licorice',
      type: 'fruit',
      flavor: 'red'
    });
    const foundCandy = await Candy.findById(newCandy.id);
    expect(foundCandy).toEqual({
      id:newCandy.id,
      name: 'licorice',
      type: 'fruit',
      flavor: 'red'
    });
  });
  it('returns null if it can\'t find the candy by id', async() => {
    const missingCandy = await Candy.findById(123456);
    expect(missingCandy).toEqual(null);
  });
  it('finds all candies', async() => {
    await Promise.all([
      Candy.insert({
        name: 'licorice',
        type: 'fruit',
        flavor: 'red'
      }),
      Candy.insert({
        name: 'Snickers',
        type: 'bar',
        flavor: 'chocolate'
      }),
      Candy.insert({
        name: 'Cotton Candy',
        type: 'fluff',
        flavor: 'air'
      })
    ]);
    const candies = await Candy.find();
    expect(candies).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'licorice', type: 'fruit', flavor: 'red' },
      { id: expect.any(String), name: 'Snickers', type: 'bar', flavor: 'chocolate' },
      { id: expect.any(String), name: 'Cotton Candy', type: 'fluff', flavor: 'air' }
    ]));
  });
  it('updates a row by id', async() => {
    const licorice = await Candy.insert({
      name: 'licorice',
      type: 'fruit',
      flavor: 'red'
    });
    const blackLicorice = await Candy.update(licorice.id, {
      name: 'licorice',
      type: 'black',
      flavor: 'black'
    });
    expect(blackLicorice).toEqual({
      id:licorice.id,
      name: 'licorice',
      type: 'black',
      flavor: 'black'
    });
  });
  it('deletes a row by id', async() => {
    const newCandy = await Candy.insert({
      name: 'licorice',
      type: 'fruit',
      flavor: 'red'
    });
    const deletedcandy = await Candy.delete(newCandy.id);
    expect(deletedcandy).toEqual({
      id:newCandy.id,
      name: 'licorice',
      type: 'fruit',
      flavor: 'red'
    });
    expect(Candy.findById(newCandy.id)).toBeNull;
  });


});
