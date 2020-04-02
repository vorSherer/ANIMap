'use strict';
// libraries
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
// eslint-disable-next-line no-unused-vars
const ejs = require('ejs');
const cors = require('cors');
const methodOverride = require('method-override');

// global variables
const app = express();
const PORT = process.env.PORT || 3001;
// middleware
app.use(cors());// allows everyone to access our information
app.use(express.static('./public'));// serves our static files from public

app.use(methodOverride('_method')); // turn a post or get into a put or delete
// set up pg
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');



app.get('/home' , displayUpcoming);
app.get('/search' ,doSearch);
app.post('/search/results', showResults);
app.get('/collection', viewCollection);
app.post('/viewDetail', viewDetail);
app.post('/add',addAnime);
app.post('/edit', editAnime);
app.post('/update', updateAnime);
app.post('/delete', deleteAnime);


function doSearch (request,response) {
  response.render('pages/search.ejs')
}


function displayUpcoming(request, response){
  let genre = request.query.genre;
  console.log('genre',genre);
  let url = ``;
  if (genre !== undefined) {
    url = `https://api.jikan.moe/v3/search/anime?status=upcoming&limit=18&genre=${genre}`;
  }
  else
  {
    url = `https://api.jikan.moe/v3/search/anime?status=upcoming&limit=18`;
  }
  console.log(url);

  superagent(url)
    .then(results => {

      let anime = results.body.results;
      let animeInfo = anime.map(index => {
        return new Anime(index);
      })
      response.render('home.ejs', {anime : animeInfo})
    })
    .catch(error =>{
      errorHandler(error, response);
    });
}


function showResults(request, response){
  let search = request.body.search
  // console.log('search', search)   // REMOVE BEFORE FINISHING
  let url = `https://api.jikan.moe/v3/search/anime?q=${search}&order_by=title&limit=15`
  superagent(url)
    .then(results => {
      let anime = results.body.results;
      let animeInfo = anime.map(index => {
        return new Anime(index);
      })
      response.render('pages/showResults.ejs', {anime : animeInfo})
    })
    .catch(error =>{
      errorHandler(error, response);
    });
}

function Anime(obj) {
  this.mal_id = obj.mal_id ? obj.mal_id : 'No id provided.';
  this.image_url = obj.image_url ? obj.image_url : 'No image available.';
  this.title = obj.title ? obj.title : 'No title provided.';
  this.type = obj.type ? obj.type : 'No type provided.';
  this.synopsis = obj.synopsis ? obj.synopsis : 'Synopsis returned empty.';
  this.rated = obj.rated ? obj.rated : 'CAUTION: Not Rated!';
  this.episodes = obj.episodes ? obj.episodes : 'Single film or no episode information.';
}


function viewDetail(request, response){
  let sqlCategory = 'SELECT DISTINCT category FROM myanimap;';
  client.query(sqlCategory)
    .then(results =>{
      let categories = results.rows;
      response.render('pages/viewDetails.ejs',({anime:request.body, myCategories:categories}));
    })
    .catch(error =>{
      errorHandler(error, response);
    })
}

function addAnime(request, response){
  let { id, image_url, title, type, synopsis, rated, episodes, myranking, comments, category} = request.body;
  let sqlAdd = 'INSERT INTO myanimap (mal_id, image_url, title, animetype, synopsis, rated, episodes, myranking, comments, category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id;';
  let safeValues = [id, image_url,title,type,synopsis,rated,episodes,myranking,comments,category];
  client.query(sqlAdd,safeValues)
    .then(results =>{
      viewCollection(request, response);
    })
    .catch(error =>{
      errorHandler(error, response);
    })
}



function viewCollection(request, response) {
  let orderBy = request.query.orderBy;
  let sqlOrderBy = '';
  if (orderBy !== undefined) {
    sqlOrderBy = 'SELECT * FROM myanimap ORDER BY ' + orderBy + ';';
  }
  else
  {
    sqlOrderBy = 'select * from myanimap order by id desc;';
  }

  let sqlCount = 'SELECT COUNT(id) FROM myanimap;';
  client.query(sqlCount)
    .then(countResults => {
      let rowCount = countResults.rows;
      client.query(sqlOrderBy)
        .then(results => {
          let animeResults = results.rows;
          response.render('pages/collection.ejs', ({animeArray: animeResults, count: rowCount[0].count}));
        }).catch(error =>{
          errorHandler(error, response);
        })
    }).catch(error =>{
      errorHandler(error, response);
    })
}

function editAnime(request, response){
  let sqlCategory = 'SELECT DISTINCT category FROM myanimap;';
  client.query(sqlCategory)
    .then(results =>{
      let categories = results.rows;
      response.render('pages/editDetails.ejs',({anime:request.body, myCategories:categories}));
    })
    .catch(error =>{
      errorHandler(error, response);
    })
}


function updateAnime(request,response){
  let {id, synopsis, comments, myranking, category } = request.body;

  let sqlUpd = `UPDATE myanimap SET synopsis=$1, comments=$2, myranking=$3, category=$4 WHERE id=$5;`;
  let safeValues = [synopsis, comments, myranking, category, id];
  client.query(sqlUpd,safeValues)
    .then(results =>{
      viewCollection(request, response);
    })
    .catch(error =>{
      errorHandler(error, response);
    })
}

function deleteAnime(request, response){
  let {id} = request.body
  let sql = 'DELETE FROM myanimap WHERE id=$1;';
  let safeValues = [id];
  client.query(sql,safeValues)
    .then(results =>{
      viewCollection(request, response);
    })
    .catch(error =>{
      errorHandler(error, response);
    })
}

function errorHandler(error, response) {
  response.status(500).send('Route not found');
}

app.get('*', (request, response) => response.status(404).send('This route does not exist'));
app.get((error, req, res) => errorHandler(error, res));


client.connect()
  .then(() => {
    app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
  });



