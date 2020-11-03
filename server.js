'use strict';

require('dotenv').config();
const express = require('express');
let superagent = require('superagent');
let pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);



let countIntoDB=0;


// const { pathToFileURL } = require('url');

const app = express();


// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

// app.use('/views', express.static('public'));

// Set the view engine for templating
app.set('view engine', 'ejs');


app.get('/', homePage);
app.get('/hello', testPage);
app.get('/searches/new', getBooks);
app.post('/searches', showResult);
app.get ('/books/:id', HandellBookID);
app.post ('/books', HandellBooks);


function HandellBookID(req, res) {

  let recordDetails= req.params.id;
  let stetment = `SELECT * FROM books WHERE id=${recordDetails};`;

  client.query(stetment).then( data =>{

    res.render('pages/books/show', { singleBook : data.rows[0] });

  }).catch((error) => {
    console.log('error happend in the HandellBookID SQL',error);
  });

 // res.send(req.params.id);

}

function HandellBooks(req, res){

  let newBookAdded = req.body;
  let statement = `INSERT INTO books (title, Author, isbn, image_url, descr) VALUES ($1,$2,$3,$4,$5);`;
  let values = [newBookAdded.title,newBookAdded.author,newBookAdded.isbn,newBookAdded.image_url,newBookAdded.descr];

  client.query(statement,values).then( data =>{

    console.log('Helllllo Diana book inserted ');
    console.log(data);
    res.redirect(`/books/${countIntoDB+1}`);

  }).catch((error) => {
    console.log('error happend in the HandellBookID SQL',error);
  });




}

function testPage(req, res) {

  // res.render('pages/index');

}




function homePage(req, res) {

  let statment = `SELECT id,title,Author,isbn,image_url,descr FROM books;`;
  client.query(statment).then(data => {
    let dataBook = data.rows;
    let totalDBbooks = data.rowCount;
    countIntoDB = data.rowCount;
    let stored = dataBook.map(bookObj => {
      return bookObj;
    });
    console.log(stored);
    res.render('pages/index', { DBbooks : stored , count : totalDBbooks});
  }).catch(() => {
    console.log('error happend in the homePage');
  });

  // res.render('pages/index');
}



function getBooks(req, res) {
  // console.log(request.body);
  res.render('pages/searches/new');
}



function showResult(req, res) {

  let recievedData = req.body;
  let url = `https://www.googleapis.com/books/v1/volumes?q=${recievedData.searchBox}+${recievedData.searchBy}`;
  superagent.get(url).then(bookResult => {
    let booksItems = bookResult.body.items;
    let selctedBooksArr = booksItems.map(info => {
      return new Book(info);
    });

    res.render('pages/searches/show', { booksItems: selctedBooksArr });
  }).catch(error => {
    console.log('Sorry .. an error Occured in Google API ', error);
  });
}



// Books constructor\\

function Book(info) {
  if (info.volumeInfo.imageLinks === undefined) {
    this.img = 'https://i.imgur.com/J5LVHEL.jpg'
  } else {
    if(!(/https:\/\//.test(info.volumeInfo.imageLinks.thumbnail))){
      this.img ='https'+info.volumeInfo.imageLinks.thumbnail.slice(4);
    }else{
      this.img = info.volumeInfo.imageLinks.thumbnail;
    }
  }
  this.title = info.volumeInfo.title ? info.volumeInfo.title : 'No Title Found';
  this.author = info.volumeInfo.authors ?info.volumeInfo.authors :'No Authors Found' ;
  this.isbn = info.volumeInfo.industryIdentifiers ?info.volumeInfo.industryIdentifiers[0].type +info.volumeInfo.industryIdentifiers[0].identifier :'No ISBN Found';
  this.description = info.volumeInfo.description ? info.volumeInfo.description : 'No Description Found';
}





client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`app is listning on port${PORT}`);
  });
}).catch(err => {
  console.log('sorry..  an error occured', err);
});


