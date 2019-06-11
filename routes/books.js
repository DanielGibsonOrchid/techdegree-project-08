const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET books list */
router.get('/', function (req, res, next) {
  Book.findAll({order: [["Year", "DESC"]]}).then(function(books){
    res.render("books/index", {books: books, title: "Daniel's Books List" });
  }).catch(function(err) {
    res.send(500, err);
  });
});


/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book){
    res.redirect("/books/");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render("books/new-book", {
        book: Book.build(req.body), 
        title: "New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500, err);
  });
});

/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("books/new-book", {book: {}, title: "New Book"});
});

/* GET Search for Book */
router.get("/search", (req, res) => {
  const { search } = req.query;
  Book.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${search}%`
          }
        },
        {
          author: {
            [Op.like]: `%${search}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${search}%`
          }
        },
        {
          year: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }
  }).then(books => {
    console.log(books);
    if(books.length > 0) {
      res.render('books/index', {books: books, title: "Search Results"});
    } else {
      res.render('page-not-found', { book: {}, title: "No results found"})
    }
  }).catch(error => {
    res.status(500).send(error);
  });
});

/* GET individual book. */
router.get("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      res.render("books/update-book", {book: book, title: `Edit/Delete: ${book.title}` });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" })
    }
  }).catch(function(err){
    res.send(500, err);
  });
});

/* PUT update book. */
router.put("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book) {
    if(book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(book){
    res.redirect("/books/");    
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      var book = Book.build(req.body);
      book.id = req.params.id;

      res.render("books/update-book", {
        book: book,
        title: "Edit Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500, err);
  });
});

/* DELETE individual book. */
router.delete("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/books");
  }).catch(function(err){
    res.send(500, err);
  });
});


module.exports = router;