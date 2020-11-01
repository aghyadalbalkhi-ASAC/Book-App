'use strict';

const express = require('express');
const { pathToFileURL } = require('url');

const app = express();

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));



// Set the view engine for templating
app.set('view engine', 'ejs');

app.get('/hello',homePage);



function homePage(req,res){

  res.render('pages/index');

}








app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
