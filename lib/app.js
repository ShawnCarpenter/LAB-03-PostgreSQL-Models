const express = require('express');
const app = express();
const Car = require('./models/car')
app.use(express.json());

app.post('/api/v1/cars', async(req, res, next) =>{
  try {
    const createdCar = await Car.insert(req.body);
    res.send(createdCar)
  } catch (error) {
    next(error)
  }
})

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));


module.exports = app;
