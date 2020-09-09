const pool = require('../utils/pool');

class Candy {
  id;
  name;
  type;
  flavor;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.type = row.type;
    this.flavor = row.flavor;
  }
  static async insert(candy) {
    const { rows } = await pool.query(
      'INSERT INTO candies (name, type, flavor ) VALUES ( $1, $2, $3) RETURNING *', [candy.name, candy.type, candy.flavor]);
  
    return new Candy(rows[0]);
  }
  static async findById(id){
    const { rows } = await pool.query('SELECT * FROM candies WHERE id = $1', [id]);
    return rows[0] ? new Candy(rows[0]) : null;
  }
  static async find() {
    const  { rows } = await pool.query('SELECT * FROM candies');
    return rows.map(row => new Candy(row));
  }

  static async update(id, updatedCandy) {
    const { rows } = await pool.query(`
    UPDATE candies
    SET name=$1,
        type=$2,
        flavor=$3
    WHERE id=$4
    RETURNING *`, [updatedCandy.name, updatedCandy.type, updatedCandy.flavor, id]);
    return new Candy(rows[0]);
  }
  static async delete(id){
    const { rows } = await pool.query('DELETE FROM candies WHERE id = $1 RETURNING *', [id]);
    return new Candy(rows[0]);
  }
}

module.exports = Candy;
