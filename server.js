const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;
require('dotenv').config();
const API_KEY = process.env.GOODREADS_KEY;
var parser = require('xml2json');

app.use(express.static('views'));

app.get('/api/goodreads', async (req, res) => {
  try {
    let data = await query_goodreads(req.query);
    res.status(200)
    res.send(data);
  } catch (err) {
    res.status(err.response.status)
    res.send(err.message)
  }
});

async function query_goodreads(q) {
  let data;
  try {
    data = await axios.get(`https://www.goodreads.com/search.xml?key=${API_KEY}&q=${q.search}`, {
    });
  } catch (err) {
    throw err;
  }
  return parse_xml_to_json(data.data);
}

function parse_xml_to_json(xml) {
  var json = parser.toJson(xml);
  let data = JSON.parse(json)
  data = data.GoodreadsResponse.search
  return data;
}

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});