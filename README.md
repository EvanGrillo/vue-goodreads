he purpose of this exercise is to explore your approach to creating a small webapp, using Vue/CSS/JS and a server-side orchestration layer in Node.js that proxies and transforms a 3rd-party API.  Specifically, you'll be building a small book-listing app, leveraging the Goodreads Public APIs using the account credentials below:

Key: RDfV4oPehM6jNhxfNQzzQ

Secret: fu8fQ5oGQEDlwiICw45dGSuxiu13STyIrxY0Rb6ibI

So that our team can review your code beforehand as well as during the interview, we ask that you use an online dev environment to host your work.  We recommend using Repl.it for the server, as it supports most mainstream languages, including external package dependencies.  The front-end portion should be built using Codepen.io -- either using their “Vue pen” templating or a standard HTML+CSS+JS template with manual App initialization.  Both of these sites offer free signup.

Steps:

1. Build an endpoint using Repl.it that accepts search and pagination info. Keep RESTful practices in mind, and please note that you will need to enable CORS headers to access your data from the client-side.

2. Extend the endpoint to connect to the Goodreads search API. Note that the API returns XML;  transform the XML into JSON and only return what your app will need.

3. Build an application in Codepen that hits the endpoint you created in Repl.it. At a minimum, your application should contain a search box that upon enter, or click of a "Search" button, triggers a search against your API. The results should be listed on the app. It's up to you what metadata you'd like to render for each book, and how you want to handle display states for pagination, errors, etc.

