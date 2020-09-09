const pool = require('../utils/pool');

class Book {
  id ;
  title;
  author;
  series;


  constructor(row){
    this.id = row.id;
    this.title = row.title;
    this.author = row.author;
    this.series = row.series;
  }
  static async insert(book) {
    const { rows } = await pool.query(
      `INSERT INTO books 
      (title, author, series) 
      VALUES ($1, $2, $3) RETURNING *`, [book.title, book.author, book.series]);

    return new Book(rows[0]);
  }
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM books WHERE id=$1', [id]);
    return rows[0] ? new Book(rows[0]) : null;
  }
  static async find(){
    const { rows } = await pool.query('SELECT * FROM books');
    return rows.map(row => new Book(row));
  }
  static async update(id, book) {
    const { rows } = await pool.query(`
      UPDATE books
      SET title=$1,
        author=$2,
        series=$3
      WHERE id=$4 
      RETURNING *`, [book.title, book.author, book.series, id]);
    return new Book(rows[0]);
  }
  static async delete(id){
    const { rows } = await pool.query('DELETE FROM books WHERE id=$1 RETURNING *', [id]);
    return new Book(rows[0]);
  } 
}

module.exports = Book;
