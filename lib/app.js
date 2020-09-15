const express = require('express');
const app = express();
const Car = require('./models/car');
app.use(express.json());

app.post('/api/v1/cars', async(req, res, next) => {
  try {
    const createdCar = await Car.insert(req.body);
    res.send(createdCar);
  } catch(error) {
    next(error);
  }
});

app.get('/api/v1/cars', async(req, res, next) => {
  try {
    const carsList = await Car.find();
    res.send(carsList);
  } catch(error) {
    next(error);
  }
});

app.get('/api/v1/cars/:id', async(req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if(car) res.send(car);
    else res.send({ error: 'The item was not found' });
  } catch(error) {
    next(error);
  }
});

app.put('/api/v1/cars/:id', async(req, res, next) => {
  try {
    const updatedCar = await Car.update(req.params.id, req.body);
    res.send(updatedCar);
  } catch(error) {
    next(error);
  }
});


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));


module.exports = app;
