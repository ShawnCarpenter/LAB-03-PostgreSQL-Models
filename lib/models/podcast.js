const pool = require('../utils/pool');

class Podcast {
  id;
  name;
  host;
  co_host;
  url;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.host = row.host;
    this.co_host = row.co_host;
    this.url = row.url;
  }
  static async insert(podcast) {
    const { rows } = await pool.query(
      'INSERT INTO podcasts (name, host, co_host, url ) VALUES ( $1, $2, $3, $4) RETURNING *', [podcast.name, podcast.host, podcast.co_host, podcast.url]);
    
    return new Podcast(rows[0]);
  }
  static async findById(id){
    const { rows } = await pool.query('SELECT * FROM podcasts WHERE id = $1', [id]);
    return rows[0] ? new Podcast(rows[0]) : null;
  }
  static async find() {
    const  { rows } = await pool.query('SELECT * FROM podcasts');
    return rows.map(row => new Podcast(row));
  }

  static async update(id, updatedPodcast) {
    const { rows } = await pool.query(`
    UPDATE podcasts
    SET name=$1,
        host=$2,
        co_host=$3,
        url=$4
    WHERE id=$5
    RETURNING *`, [updatedPodcast.name, updatedPodcast.host, updatedPodcast.co_host, updatedPodcast.url, id]);
    return new Podcast(rows[0]);
  }
  static async delete(id){
    const { rows } = await pool.query('DELETE FROM podcasts WHERE id = $1 RETURNING *', [id]);
    return new Podcast(rows[0]);
  }
}

module.exports = Podcast;
