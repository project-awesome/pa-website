
# pa-website
=======

Website backend for Project Awesome, 
developed with node.js, deployable on Heroku.

# Getting Started

To get started with this code, you need to set up a few things first.  This list may not be complete; we'll add to it, as we discover things that are missing.

At a minimum, you'll need to set up your development environment with:
* The Heroku toolbelt for working with Node.js (follow the tutorial at heroku.com)
 * This includes, at least, git, node, and npm
* For running and testing locally, you'll also need Postgres.  See: http://www.postgresql.org/download/

After forking the repo, you need to run `npm install` from the root directory.  This will install various node.js modules as specified in package.json.  This includes, among other things:

* mocha, which is a test framework for node
* passport, which is used for authenticating against Facebook, Google, etc. for logins
* sequelize, which provides a database abstraction layer

To be able to run tests locally, you may also need to do:

```
sudo npm install mocha -g
```

To see if that worked, try typing `mocha` at the command line.  You should see something like this:

```
169-231-89-105:awesome-ui-backend-node-heroku pconrad$ mocha


  0 passing (3ms)

169-231-89-105:awesome-ui-backend-node-heroku pconrad$ 
```


# Setting up your environment variables

Define:

```
DATABASE_URL=postgres://postgres@localhost/postgres
```

# A bit of Postgres 

* `psql` is the command to get into the postgres command line
* `\l` lists databases 

# Reading List

 Subject   | What it is | Where to learn more
 ---------- | --------- | ----------------------
 Node.js    | Server-side JavaScript | https://nodejs.org/
 Heroku    | Hosting for webapps | http://www.heroku.com
 Bootstrap | Javascript client-side framework | http://getbootstrap.com/getting-started/
 Selenium | Test framework for browser interactions |  http://www.seleniumhq.org/
 Travis-CI | Continous Integration Framework | https://travis-ci.org/
 Passport  | Authentication for node.js apps | http://passportjs.org/
 PostgreSQL | SQL database that works with Heroku | http://www.postgresql.org/
 Browserify | node.js npm modules in client side code | https://github.com/substack/browserify-handbook
 
# What Unit testing framework is best for node.js?

* http://stackoverflow.com/questions/7254025/node-js-unit-testing
* http://unitjs.com/
* http://mochajs.org/
* others?



# Contributors
* Phil Conrad
* Martin Wolfenbarger


