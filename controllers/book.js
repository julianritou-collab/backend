const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find().then(
        (books) => {
        res.status(200).json(books);
        }
    ).catch(
        (error) => {
            res.status(400).json({ error });
        }
    );
};

exports.createBook = (req, res, next) => {
    const bookobject = JSON.parse(req.body.book);
    delete bookobject._userId;
    const book = new Book({
        ...bookobject,
        userId: req.auth.userId,
        ratings: [],
        averageRating: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => {
        // Supprimer l'image du serveur en cas d'erreur lors de l'enregistrement du livre
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            res.status(400).json({ error });
        });
    });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    }).then(
        (book) => {
        res.status(200).json(book);
        }
    ).catch(
        (error) => {
        res.status(404).json({ error});
        }
    );
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
       ...JSON.parse(req.body.book),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
 
    delete bookObject._userId;
    const { title, author, year, genre } = bookObject;
    if (!title?.trim() || !author?.trim() || !year || !genre?.trim()) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(422).json({ message: 'Un ou plusieurs champs sont vides ou invalides' });
    }

    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : 'Requête non autorisée'});
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => {
                    // Supprimer l'ancienne image APRÈS succès de la mise à jour
                    if (req.file) {
                        const filename = book.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {});
                    }
                    res.status(200).json({ message: 'Livre modifié!' });
                })
                .catch(error => {
                    // Supprimer la nouvelle image si la mise à jour échoue
                    if (req.file) fs.unlink(req.file.path, () => {});
                    res.status(400).json({ error });
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {
      if (book.userId != req.auth.userId) {
          res.status(403).json({ message : 'Requête non autorisée'});
      } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => { 
          Book.deleteOne({ _id: req.params.id})
              .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
              .catch(error => res.status(400).json({ error }));
          });
      }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

exports.rateBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        const alreadyRated = book.ratings.some(rating => rating.userId === req.auth.userId);
        if (alreadyRated) {
            return res.status(409).json({ message: 'Vous avez déjà noté ce livre.' });
        }

        book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });

        const total = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        book.averageRating = total / book.ratings.length;

        book.save()
            .then((updatedBook) => res.status(200).json(updatedBook))
            .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getBestRatedBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};