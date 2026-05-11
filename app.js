const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/api/books', (req, res, next) => {
  const books = [
    {
      _id: '0987654321',
      userid: 'julian',
      title: 'Livre1',
      author: 'Julian Ritou',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      year: 2026,
      genre: 'fiction',
      ratings: [],
      averageRating: 0,      
    },
    {
      _id: '1234567890',
      userid: 'julian',
      title: 'Livre2',
      author: 'Julian Ritou',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      year: 2025,
      genre: 'fiction',
      ratings: [],
      averageRating: 0, 
    },     
  ];
  res.status(200).json(books);
});

module.exports = app;