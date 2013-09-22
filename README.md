cooking
=======

A web site to store cooking recipes. The code is written in Node.js and the data stored in a MongoDB database.

This site uses Express.js to handle the server-side part of the project including routing, cookies, and fetching data from the database. All data is returned as JSON to the client.

Angular.js is used to handle the client-side part of the project including making the requests for data to the server, switching views, and client-side routing.

This means that there is an MVC framework in the server side (Express.js) and another in the client-side (Angular.js).


Requirements
------------
To run this code you need to have **Node.js** installed on your machine. If you don't have Node.js you can get it from [nodejs.org](http://nodejs.org)

Clone this repo to your local machine:

    git clone git@github.com:hectorcorrea/cooking.git

Install the dependencies:

    cd ~/dev/cooking
    npm install 


How to run the site
-------------------
Download the source code and install the requirements listed above.

To kick off the application, just run the following command from the Terminal window: 

    node server 

...and browse to your *http://localhost:3000* You should see the web site. Enjoy it!


Structure of the source code
----------------------------
Server Side: 

* **server.js** is the main file. This file mainly setups the environment.
* **\models:** JavaScript files with the server-side models and database access code. 
* **\routes\recipeRoutes.js:** is the server-side controller. This code is the one that parses requests, contacts the database, and returns the data to the client. All data is returned in JSON.
* **\views\index.ejs:** This is the only server-side view. It's basically a template on which different partial views will be injected client-side by Angular.js

Client Side:

* **\public\js\app.js:** This file configures Angular.js to handle each route, switch views, and process the data coming from the server. 
* **\public\partials:** These are the views that Angular.js uses to display data.


Questions, comments, thoughts?
------------------------------
Feel free to contact me with questions or comments about this project.

