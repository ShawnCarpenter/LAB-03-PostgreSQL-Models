const fs = require('fs');
const pool = require('../utils/pool');
const Podcast = require('./podcast');
describe('Podcast Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert new Podcast into database', async() => {
    const newPodcast = await Podcast.insert({
      name: 'I Don\'t Even Oen a Television',
      host: 'JW Friedman',
      co_host: 'Chris Collision',
      url: 'https://www.idontevenownatelevision.com/'
    });
    const { rows } = await pool.query('SELECT * FROM podcasts WHERE id=$1', [newPodcast.id]);
    expect(newPodcast).toEqual(rows[0]);
  });
  it('find Podcast by id', async() => {
    const newPodcast = await Podcast.insert({
      name: 'I Don\'t Even Own a Television',
      host: 'JW Friedman',
      co_host: 'Chris Collision',
      url: 'https://www.idontevenownatelevision.com/'
    });
    const foundPodcast = await Podcast.findById(newPodcast.id);
    expect(foundPodcast).toEqual({
      id:newPodcast.id,
      name: 'I Don\'t Even Own a Television',
      host: 'JW Friedman',
      co_host: 'Chris Collision',
      url: 'https://www.idontevenownatelevision.com/'
    });
  });
  it('returns null if it can\'t find the Podcast by id', async() => {
    const missingPodcast = await Podcast.findById(123456);
    expect(missingPodcast).toEqual(null);
  });
  it('finds all podcasts', async() => {
    await Promise.all([
      Podcast.insert({
        name: 'I Don\'t Even Own a Television',
        host: 'JW Friedman',
        co_host: 'Chris Collision',
        url: 'https://www.idontevenownatelevision.com/'
      }),
      Podcast.insert({
        name: 'Worst Best Sellers',
        host: 'Renata',
        co_host: 'Kait',
        url: 'https://www.frowl.org/worstbestsellers/'
      }),
      Podcast.insert({
        name: 'Sawbones',
        host: 'Dr. Sydnee McElroy',
        co_host: 'Justin McElroy',
        url: 'https://maximumfun.org/podcasts/sawbones/'
      })
    ]);
    const podcasts = await Podcast.find();
    expect(podcasts).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'I Don\'t Even Own a Television', host: 'JW Friedman', co_host: 'Chris Collision', url: 'https://www.idontevenownatelevision.com/' }, 
      { id:expect.any(String), name: 'Worst Best Sellers', host: 'Renata', co_host: 'Kait', url: 'https://www.frowl.org/worstbestsellers/'
      },
      {id:expect.any(String), name: 'Sawbones', host: 'Dr. Sydnee McElroy', co_host: 'Justin McElroy', url: 'https://maximumfun.org/podcasts/sawbones/'}
    ]));
  });
  it('updates a row by id', async() => {
    const ideotvpod = await Podcast.insert({
      name: 'I Don\'t Even Own a Television',
      host: 'JW Friedman',
      co_host: 'Chris Collision',
      url: 'https://www.idontevenownatelevision.com/'
    });
    const oldIdeotvpod = await Podcast.update(ideotvpod.id, {
      name: 'I Don\'t Even Own a Television',
      host: 'JW Friedman',
      co_host: null,
      url: 'https://www.idontevenownatelevision.com/'
    });
    expect(oldIdeotvpod).toEqual({
      id:oldIdeotvpod.id,
      name: 'I Don\'t Even Own a Television',
      host: 'JW Friedman',
      co_host: null,
      url: 'https://www.idontevenownatelevision.com/'
    });
  });
  it('deletes a row by id', async() => {
    const newPodcast = await Podcast.insert({
      name: 'I Don\'t Even Own a Television',
      host: 'JW Friedman',
      co_host: 'Chris Collision',
      url: 'https://www.idontevenownatelevision.com/'
    });
    const deletedPodcast = await Podcast.delete(newPodcast.id);
    expect(deletedPodcast).toEqual({
      id:newPodcast.id,
      name: 'I Don\'t Even Own a Television',
      host: 'JW Friedman',
      co_host: 'Chris Collision',
      url: 'https://www.idontevenownatelevision.com/'
    });
    expect(Podcast.findById(newPodcast.id)).toBeNull;
  });


});
