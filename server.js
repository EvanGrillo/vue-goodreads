const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;
require('dotenv').config();
const API_KEY = process.env.GOODREADS_KEY;

app.use(express.static('views'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
	let devMode = Boolean(req.query.dev);
	res.render('index', {
		title: 'Goodreads Search UI', 
		devMode: devMode
	})
})

app.get('/api/goodreads', async (req, res) => {
	try {
		let data = await query_goodreads(req.query);
		res.send(data);
	} catch (err) {
		res.status(err.response.status || 500)
		res.send(err.message)
	}
});

query_goodreads = async (q) => {
	let data;
	try {
		data = await axios.get(`https://www.goodreads.com/search.xml?key=${API_KEY}&q=${q.search}&page=${q.page}`);
	} catch (err) {
		throw err;
	}
	return parse_xml(data.data);
}

parse_xml = (data) => {
    return {
		total_results: Number((/<total-results>([\s\S]*?)<\/total-results>/i).exec(data)[1]) || 0,
		results: (
            (data.match(/<work>([\s\S]*?)<\/work>/gi) || [])
            .map((w) => {
                return {
                    _id: (w.match(/<id type="integer">([\s\S]*?)<\/id>/) || [])[1] || null,
                    title: (w.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || null,
                    author: (w.match(/<name>([\s\S]*?)<\/name>/) || [])[1] || null,
                    average_rating: (w.match(/<average_rating>([\s\S]*?)<\/average_rating>/) || [])[1] || null,
                    image_url: (w.match(/<image_url>([\s\S]*?)<\/image_url>/) || [])[1] || null,
                    publish_year: (w.match(/<original_publication_year type="integer">([\s\S]*?)<\/original_publication_year>/) || [])[1] || null,
                    publish_month: (w.match(/<original_publication_month type="integer">([\s\S]*?)<\/original_publication_month>/) || [])[1] || null,
                    publish_day: (w.match(/<original_publication_day type="integer">([\s\S]*?)<\/original_publication_day>/) || [])[1] || null,
                }
            })
        )
	}
}

app.listen(port, () => { 
	console.log(`Listening at ${port}`)
});
