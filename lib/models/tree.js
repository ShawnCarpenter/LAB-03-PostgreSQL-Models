const pool = require('../utils/pool');
class Tree {
  id;
  name;
  oregonNative;
  use;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.oregonNative = row.oregon_native;
    this.use = row.use;
  }
  
  static async insert(tree){
    const { rows } = await pool.query(
      `INSERT INTO trees 
      (name, oregon_native, use) 
      VALUES ($1, $2, $3) RETURNING *`, [tree.name, tree.oregonNative, tree.use]);

    return new Tree(rows[0]);
  }
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM trees WHERE id=$1', [id]);
    return rows[0] ? new Tree(rows[0]) : null;
  }
  static async find(){
    const { rows } = await pool.query('SELECT * FROM trees');
    return rows.map(row => new Tree(row));
  }
  static async update(id, tree) {
    const { rows } = await pool.query(`
      UPDATE trees
      SET name=$1,
        oregon_native=$2,
        use=$3
      WHERE id=$4 
      RETURNING *`, [tree.name, tree.oregonNative, tree.use, id]);
    return new Tree(rows[0]);
  }
  static async delete(id){
    const { rows } = await pool.query('DELETE FROM trees WHERE id=$1 RETURNING *', [id]);
    return new Tree(rows[0]);
  }
}


module.exports = Tree;
