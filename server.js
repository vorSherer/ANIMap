'use strict';
// libraries
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
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
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.get('/home' , displayUpcoming);
app.post('/search/results', showResults);
app.get('/collection', viewCollection);
app.post('/viewDetail', viewDetail);
app.post('/add',addAnime);
app.post('/edit', editAime);

app.get('/search' , (request,response) => {
  response.render('pages/search.ejs')
})


function displayUpcoming(request, response){
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
}


function showResults(request, response){
  let search = request.body.search
  // console.log('search', search)   // REMOVE BEFORE FINISHING
  let url = `https://api.jikan.moe/v3/search/anime?q=${search}&order_by=title&limit=15`
  superagent(url)
    .then(results => {
      // console.log('anime results',results.body.results)   // REMOVE BEFORE FINISHING
      let anime = results.body.results;
      let animeInfo = anime.map(index => {
        return new Anime(index);
      })
      response.render('pages/showResults.ejs', {anime : animeInfo})
    })
    .catch(error =>{
      Error(error, response);
    });
}

function Anime(obj) {
  this.mal_id = obj.mal_id; // TODO: decifde if this value es “id” or “mal_id”
  this.image_url = obj.image_url;
  this.title = obj.title;
  this.type = obj.type;
  this.synopsis = obj.synopsis;
  this.rated = obj.rated;
  this.episodes = obj.episodes;
}

app.get('/collection', (request, response) => {
  let sql = 'SELECT * FROM myANIMap;';
  let sqlCount = 'SELECT COUNT(id) FROM myANIMap;';
  client.query(sqlCount)
    .then(countResults => {
      console.log('dB row count: ', countResults.rows);   // REMOVE BEFORE FINISHING
      let rowCount = countResults.rows;
      client.query(sql)
        .then(results => {
          let animeResults = results.rows;
          console.log('return from dB: ', animeResults);   // REMOVE BEFORE FINISHING
          // let animeCount = animeResults.length;
          // console.log('count= ', animeCount);   // REMOVE BEFORE FINISHING
          response.render('pages/collection.ejs', ({animeArray: animeResults, count: rowCount[0].count}));
        })
    })
    .catch(error =>{
      Error(error, response);
    })
})


function viewDetail(request, response){
  // console.log('now in viewDetail()');
  // let {image_url, title, type, rated, id, episodes, synopsis} = request.body;
  // TODO: obtain id properly
  let sqlCategory = 'SELECT DISTINCT category FROM myANIMap;';
  client.query(sqlCategory)
    .then(results =>{
      let categories = results.rows;
      response.render('pages/viewDetails.ejs',({anime:request.body, myCategories:categories}));
    })
    .catch(error =>{
      Error(error, response);
    })
}

function addAnime(request, response){
  let { id, image_url, title, type, synopsis, rated, episodes, myRanking, comments, category} = request.body;
  let sqlAdd = 'INSERT INTO myAnimap (mal_id, image_url, title, animeType, synopsis, rated, episodes, myRanking, comments, category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id;';
  let safeValues = [id, image_url,title,type,synopsis,rated,episodes,myRanking,comments,category]
  client.query(sqlAdd,safeValues)
    .then(results =>{
      viewCollection(request, response);
    })
    .catch(error =>{
      Error(error, response);
    })
}



function viewCollection(request, response) {
  let sql = 'SELECT * FROM myANIMap;';
  let sqlCount = 'SELECT COUNT(id) FROM myANIMap;';
  client.query(sqlCount)
    .then(countResults => {
      // console.log('dB row count: ', countResults.rows);   // REMOVE BEFORE FINISHING
      let rowCount = countResults.rows;
      client.query(sql)
        .then(results => {
          let animeResults = results.rows;
          // console.log('return from dB: ', animeResults);   // REMOVE BEFORE FINISHING
          // let animeCount = animeResults.length;
          // console.log('count= ', animeCount);   // REMOVE BEFORE FINISHING
          response.render('pages/collection.ejs', ({animeArray: animeResults, count: rowCount[0].count}));
        })
    })
    .catch(error =>{
      Error(error, response);
    })
}
// console.log(request.body);
// console.log('image_url',image_url );
// console.log('id', id);
// console.log('title', title);
// console.log('type',type );
// console.log('rated', rated);
// console.log('episodes', episodes);
// console.log('synopsis', synopsis);
// console.log('comments', comments);
// console.log('myRanking', myRanking);
// console.log('category', category);


function editAime(request, response){
  console.log(request.body);
  let sqlCategory = 'SELECT DISTINCT category FROM myANIMap;';
  client.query(sqlCategory)
    .then(results =>{
      let categories = results.rows;
      response.render('pages/editDetails.ejs',({anime:request.body, myCategories:categories}));
    })
    .catch(error =>{
      Error(error, response);
    })
}

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
client.connect()
  .then(() => {
    app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
  });



