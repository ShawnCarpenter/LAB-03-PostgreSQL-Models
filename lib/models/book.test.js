const fs = require('fs');
const pool = require('../utils/pool');
const Book = require('./book');

describe('Book model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new book into the database', async() => {
    const newBook = await Book.insert({
      title: 'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'Discworld'
    });
    const { rows } = await pool.query('SELECT * FROM books WHERE id=$1', [newBook.id]);
    expect(newBook).toEqual(rows[0]);
  });
  
  it('finds a book by id', async() => {
    const newBook = await Book.insert({
      title: 'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'Discworld'
    });
    const foundBook = await Book.findById(newBook.id);
    expect(foundBook).toEqual({
      id:newBook.id,
      title: 'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'Discworld'
    });
  });
  it('returns null if the id is not in the database', async() => {
    const missingBook = await Book.findById(123456789);
    expect(missingBook).toBeNull();
  });
  it('finds all the books in the database', async() => {
    await Promise.all([
      Book.insert({
        title: 'Guards, Guards',
        author: 'Terry Pratchett',
        series: 'Discworld'
      }),
      Book.insert({
        title: 'American Gods',
        author: 'Neil Gaiman',
        series: null
      }),
      Book.insert({
        title: 'The Two Towers',
        author: 'J.R.R. Tolkein',
        series: 'The Lord of the Rings'
      })
    ]);
    const books = await Book.find();
    expect(books).toEqual(expect.arrayContaining([
      { id: expect.any(String), title: 'Guards, Guards', author: 'Terry Pratchett', series: 'Discworld' },
      { id: expect.any(String), title: 'American Gods', author: 'Neil Gaiman', series: null },
      { id:expect.any(String), title: 'The Two Towers', author: 'J.R.R. Tolkein', series: 'The Lord of the Rings' }
    ]));
  });
  it('updates records', async() => {
    const newBook = await Book.insert({
      title: 'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'Discworld'
    });
    const updatedBook = await Book.update(newBook.id, {
      title:'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'The Watch'
    });
    expect(updatedBook).toEqual({
      id:newBook.id,
      title:'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'The Watch'
    });
  });
  it('deletes items', async() => {
    const newBook = await Book.insert({
      title: 'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'Discworld'
    });
    const deletedBook = await Book.delete(newBook.id);
    expect(deletedBook).toEqual({
      id: newBook.id,
      title: 'Guards, Guards',
      author: 'Terry Pratchett',
      series: 'Discworld'
    });
    const foundBook = await Book.findById(newBook.id);
    expect(foundBook).toBeNull();
  });
});
