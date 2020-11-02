'use strict';

require('dotenv').config();
const express = require('express');
let superagent = require('superagent');
// const { pathToFileURL } = require('url');

const app = express();


// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

// app.use('/views', express.static('public'));

// Set the view engine for templating
app.set('view engine', 'ejs');

app.get('/hello', homePage);


function homePage(req, res) {

  res.render('pages/index');

}

app.get('/searches/new', getBooks);

function getBooks(req, res) {
  // console.log(request.body);
  res.render('pages/searches/new');
}

app.post('/searches', showResult)

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
      console.log(info.volumeInfo.imageLinks.thumbnail);
      this.img ='https'+info.volumeInfo.imageLinks.thumbnail.slice(4);
      console.log('after',this.img);
    }else{
      this.img = info.volumeInfo.imageLinks.thumbnail;
    }
  }
  this.title = info.volumeInfo.title;
  this.author = info.volumeInfo.authors;
  this.description = info.volumeInfo.description;
}





app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
