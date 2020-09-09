const pool = require('../utils/pool');

class Car {
  id ;
  make;
  model;
  year;
  color;

  constructor(row){
    this.id = row.id;
    this.make = row.make;
    this.model = row.model;
    this.year = row.year;
    this.color = row.color;
  }
  static async insert(car) {
    const { rows } = await pool.query(
      `INSERT INTO cars 
      (make, model, year, color) 
      VALUES ($1, $2, $3, $4) RETURNING *`, [car.make, car.model, car.year, car.color]);

    return new Car(rows[0]);
  }
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM cars WHERE id=$1', [id]);
    return rows[0] ? new Car(rows[0]) : null;
  }
  static async find(){
    const { rows } = await pool.query('SELECT * FROM cars');
    return rows.map(row => new Car(row));
  }
  static async update(id, car) {
    const { rows } = await pool.query(`
      UPDATE cars
      SET make=$1,
        model=$2,
        year=$3,
        color=$4
      WHERE id=$5 
      RETURNING *`, [car.make, car.model, car.year, car.color, id]);
    return new Car(rows[0]);
  }
  static async delete(id){
    const { rows } = await pool.query('DELETE FROM cars WHERE id=$1 RETURNING *', [id])
    return new Car(rows[0])
  } 
}

module.exports = Car;
