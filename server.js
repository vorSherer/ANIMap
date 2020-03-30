'use strict';

// framework
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');


// GLOBAL VARIABLES
const PORT = process.env.PORT || 3001;




app.get('/',testIris);


function testIris(request,response){
// PLEASE DON'T DELETE THIS YET
// Define our query variables and values that will be used in the query request
var variables = {
  id: 15125
};

// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
var query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
    id
    title {
      romaji
      english
      native
    }
  }
}
`;

  let apiURL = 'https://graphql.anilist.co';
  superagent.post(apiURL)
  // request.post('/user')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        query: query,
        variables: variables
    }))
      .then(results =>{
        console.log(results.body);
        response.json(results.body);
      })
      .catch(errorCallback)
}


function callback(){

}


// ____________________ Thomas' Jikan Test ____________________//
// app.get('/tom', testThomas);

// function testThomas( request, response) {
//   let jikanQuery = `https://api.jikan.moe/v3/search/anime?genre[]=1&genre[]2&rated=pg13`;
//   superagent.get(jikanQuery)
//     .then(result => {
//       console.log(results.body)
//     }).catch(errorCallback)
// }








function errorCallback(err){
  console.log(err);
}


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))


app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});