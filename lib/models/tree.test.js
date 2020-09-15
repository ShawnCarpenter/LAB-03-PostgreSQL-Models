const fs = require('fs');
const pool = require('../utils/pool');
const Tree = require('./tree');

describe('Tree model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new tree into the database', async() => {
    const newTree = await Tree.insert({
      name: 'Douglas Fir',
      oregonNative: true,
      use: 'Timber'
    });
    const { rows } = await pool.query('SELECT * FROM trees WHERE id=$1', [newTree.id]);
    expect(newTree).toEqual(new Tree(rows[0]));
  });
  
  it('finds a tree by id', async() => {
    const newTree = await Tree.insert({
      name: 'Douglas Fir',
      oregonNative: true,
      use: 'Timber'
    });
    const foundTree = await Tree.findById(newTree.id);
    expect(foundTree).toEqual({
      id:newTree.id,
      name: 'Douglas Fir',
      oregonNative: true,
      use: 'Timber'
    });
  });
  it('returns null if the id is not in the database', async() => {
    const missingTree = await Tree.findById(123456789);
    expect(missingTree).toBeNull();
  });
  it('finds all the trees in the database', async() => {
    await Promise.all([
      Tree.insert({
        name: 'Douglas Fir',
        oregonNative: true,
        use: 'Timber'
      }),
      Tree.insert({
        name: 'Apple',
        oregonNative: false,
        use: 'Fruit'
      }),
      Tree.insert({
        name: 'Oak',
        oregonNative: true,
        use: 'acorns, barrels'
      })
    ]);
    const trees = await Tree.find();
    expect(trees).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'Douglas Fir', oregonNative: true, use: 'Timber' },
      { id: expect.any(String), name: 'Apple', oregonNative: false, use: 'Fruit' },
      { id:expect.any(String), name: 'Oak', oregonNative: true, use: 'acorns, barrels' }
    ])
    );});
  it('updates records', async() => {
    const newTree = await Tree.insert({
      name: 'Douglas Fir',
      oregonNative: true,
      use: 'Timber'
    });
    const updatedTree = await Tree.update(newTree.id, {
      name:'Douglas Fir',
      oregonNative: true,
      use: 'Kindling'
    });
    expect(updatedTree).toEqual({
      id:newTree.id,
      name:'Douglas Fir',
      oregonNative: true,
      use: 'Kindling'
    });
  });
  it('deletes items', async() => {
    const newTree = await Tree.insert({
      name: 'Douglas Fir',
      oregonNative: true,
      use: 'Timber'
    });
    const deletedTree = await Tree.delete(newTree.id);
    expect(deletedTree).toEqual({
      id: newTree.id,
      name: 'Douglas Fir',
      oregonNative: true,
      use: 'Timber'
    });
    const foundTree = await Tree.findById(newTree.id);
    expect(foundTree).toBeNull();
  });
});

