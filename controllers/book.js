const Book = require('../models/book');

exports.getAllBooks = (req, res, next) => {
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
};

exports.createBook = (req, res, next) => {
};

exports.getOneBook = (req, res, next) => {
};

exports.modifyBook = (req, res, next) => {
};

exports.deleteBook = (req, res, next) => {
};

exports.rateBook = (req, res, next) => {
};

exports.getBestRatedBooks = (req, res, next) => {
};