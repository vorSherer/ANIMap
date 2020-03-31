'use strict';
// libraries
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
// const pg = require('pg');
// eslint-disable-next-line no-unused-vars
const ejs = require('ejs');
const cors = require('cors');

// global variables
const app = express();
const PORT = process.env.PORT || 3001;
// middleware
app.use(cors());// allows everyone to access our information
app.use(express.static('./public'));// serves our static files from public

// app.use(methodOverride('_method')); // turn a post or get into a put or delete
// set up pg
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/search' , (request,response) => {
  response.render('pages/search.ejs')
})

app.get('/home' , (request,response) => {
  let url = `https://api.jikan.moe/v3/search/anime?status=upcoming&limit=18`
  superagent(url)
    .then(results => {

      let anime = results.body.results;
      let animeInfo = anime.map(index => {
        return new Anime(index);
      })
      response.render('home.ejs', {anime : animeInfo})
    })
    .catch(error =>{
      Error(error, response);
    });
})

app.post('/search/results', (request,response) => {
  let search = request.body.search
  console.log('search', search)
  let url = `https://api.jikan.moe/v3/search/anime?q=${search}&order_by=title&limit=15`
  superagent(url)
    .then(results => {
      console.log('anime results',results.body.results)
      let anime = results.body.results;
      let animeInfo = anime.map(index => {
        return new Anime(index);
      })
      response.render('pages/showResults.ejs', {anime : animeInfo})
    })
    .catch(error =>{
      Error(error, response);
    });
})

function Anime(obj) {
  this.mal_id = obj.mal_id;
  this.image_url = obj.image_url;
  this.title = obj.title;
  this.type = obj.type;
  this.synopsis = obj.synopsis;
  this.rated = obj.rated;
  this.episodes = obj.episodes;
}






app.listen(PORT, () => console.log(`Listening on port ${PORT}`))



