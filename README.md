cooking
=======

A web site to store cooking recipes. This project is early in its 
development. At this time you can only see a couple of recipes already
added to the database and nothing more.

The site will eventually allow users to add recipes and search for them. 


Requirements
------------
To run this code you need to have **Node.js** installed on your machine. If you don't have Node.js you can get it from [nodejs.org](http://nodejs.org)

Clone this repo to your local machine.

    git clone git@github.com:hectorcorrea/cooking.git

Last but not least, you'll need to install **Express** and **EJS** by running the following command from the Terminal *from inside the folder where you downloaded the source code*

    cd ~/dev/cooking
    npm install 

Express is an MVC-like JavaScript framework that takes care of the boiler plate code to handle HTTP requests and responses. [More info](http://expressjs.com)

EJS is a template engine for Node.js used to generate HTML pages with dynamic content. [More info](https://github.com/visionmedia/ejs)


How to run the site
-------------------
Download the source code and install the requirements listed above.

To kick off the application, just run the following command from the Terminal window: 

    node app 

...and browse to your *http://localhost:3000* You should see the rather anti-climactic web site with the beginnings of what will eventually be a web site to store cooking recipes. Enjoy it!


Structure of the source code
----------------------------
**app.js** is the main file. The rest of the code is organized as follow:

* **\models:** JavaScript files with the models
* **\routes:** JavaScript files with the controllers
* **\views:** The views of the project (HTML + EJS)
* **\public:** Static public files (client side JavaScript, CSS)

The **unit tests** for the models and the controllers are on the same 
folder as the respective functionality (i.e. inside models and routes.) 
You can run the tests for each class individually (e.g. node recipeModelTest)


Questions, comments, thoughts?
------------------------------
This is a very rough work in progress as I learn and play with Node.js.

Feel free to contact me with questions or comments about this project.

You can see a running version version of this code here:

  TODO: (enter jitsu URL once it's available there)
  http://cooking.jit.su

Keep in mind that the site currently *does not suport authentication* and therefore
you won't be able to add new recipes or update the existing ones on the live site.
That will change once authentication has been added.

