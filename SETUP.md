SETUP.md

# Before you start

Things you need before you can start:

* Install node.js (including npm) https://nodejs.org/
* Install Postgres  http://www.postgresql.org/
* Install browserify ( `sudo npm install -g browserify` )

# Fork the repo

Look over the documentation on [github workflow](/DOCS/GithubWorkflow.md) and then create a fork of the main repo, [ucsb-cs-education/awesome-ui-backend-node-heroku](https://github.com/ucsb-cs-education/awesome-ui-backend-node-heroku).

# Update the node.js modules and selenium driver

Use `cd` to put yourself in the main directory of the repo. You now need to install the necesssary node.js modules on which project awesome depends.  These are cached in a directory called node_modules that is NOT checked into the github repository.   You install these with the command:

```
npm update
```

After doing this, you also need to update the Selenium jar separately, with this command:

```
./node_modules/protractor/bin/webdriver-manager update 
```

# Create a setupPrivateEnv.sh file

The file `setupPrivateEnv.sh` is listed in the `.gitignore` file.    This file is NOT checked into the github repo, because it will contain private information---the keys needed to interact with Facebook and Google authentication, as well as Sauce Labs and Travis CI.

The contents of this file are a series of environment variables, as shown below.  Get the correct values from someone involved in the project (these are not stored in the public repo).  (TODO: write some documentation on how someone not directly connected with the project could set up their own implementation by interacting with Facebook, Google, and Sauce in the way that our project team did to obtain these values.)

```
export DATABASE_URL="postgres://$USER@localhost/postgres"
export SESSION_SECRET="xxxxxxx"
export FACEBOOK_APP_ID="xxxxxxx"
export FACEBOOK_APP_SECRET="xxxxxxxx"
export FACEBOOK_CALLBACK_URL="http://localhost:5000/auth/facebook/callback"
export FACEBOOK_TEST_EMAIL="someone@example.org"
export FACEBOOK_TEST_PASSWORD="xxxxxxxx"
export GOOGLE_APP_ID="xxxxxxxx.apps.googleusercontent.com"
export GOOGLE_APP_SECRET="xxxxxxxx"
export GOOGLE_CALLBACK_URL="http://localhost:5000/auth/google/callback"
export GOOGLE_TEST_EMAIL="someone@example.org"
export GOOGLE_TEST_PASSWORD="xxxxxxxx"
```

Put this file in the top level of your github repo so that the .gitignore will properly ignore it.  Then, anytime you want to run project awesome code locally, first add these environment variables to your shell by typing:

```
. ./setupPrivateEnv.sh
```

# Did it work?

Try typing:

```
npm test
```

You should see test cases passing.  If you don't, something is wrong.


# Heroku Setup

In addition to the stuff that is on the heroku web page for setting up a new app, you also need to:

```
 heroku addons:create heroku-postgresql:hobby-dev
```

Sample output: 
 ``` 
shell-prompt$ heroku addons:create heroku-postgresql:hobby-dev
Creating cooling-gladly-9335... done, (free)
Adding cooling-gladly-9335 to project-awesome-phill-dev... done
Setting DATABASE_URL and restarting project-awesome-phill-dev... done, v4
Database has been created and is available
 ! This database is empty. If upgrading, you can transfer
 ! data from another database with pgbackups:restore
Use `heroku addons:docs heroku-postgresql` to view documentation.
shell-prompt$
```

Then do:  heroku config

You will get back some output such as this:

```
 DATABASE_URL: postgres://sdlfiwneofiwe:RHGBmTuDFwfwefwNsy1C_eVzPPOBd5NE@ec2-54-163-228-0.compute-1.amazonaws.com:5432/wefoiwefoie324234wf
```

You need to set up that environment variable in the Heroku app settings.
 
You then need to set up Facebook and Google logins

## Facebook

https://developers.facebook.com/apps/

Create a new app.

You'll get back an App Id.   FACEBOOK_APP_ID  is the env var that needs to point to that.

Also go to "Settings" / "Advanced" and scroll to "Client OAuth Settings".  Enter the URL for the Facebook Oauth Callback (i.e. https://project-awesome-us.herokuapp.com/auth/facebook/callback )

Under settings, add a contact email.

Under Status and Review, either set to public--or don't, depending on whether this is a production instance or a test/dev instance.

```
 FACEBOOK_APP_ID   set to what's on the https://developers.facebook.com/apps/ page
 FACEBOOK_APP_SECRET   set to what's on the https://developers.facebook.com/apps/ page
 FACEBOOK_CALLBACK_URL https://project-awesome-us.herokuapp.com/auth/facebook/callback
```

You'll then do something similar for Google at https://console.developers.google.com/project?authuser=0

Create the app, then navigate to APIs.   Navigate to the Google+ API.  Click "Enable API".

Then go to Credentials.

Under OAuth, go to "create a new client id".

Create a new application/web application.

Under authorized JavaScript origins, use: https://project-awesome-us.herokuapp.com

Under Callback URL, use: https://project-awesome-us.herokuapp.com/auth/google/callback



```
 GOOGLE_APP_ID
 GOOGLE_APP_SECRET
 GOOGLE_CALLBACK_URL
```

Node Modules Cache indicates whether we want to cache the node modules.    Since we are using project awesome as a module, right now we don't want that cached.  Or do we?   TODO: Figure this out.  Maybe do proper versioning on the project-awesome NPM module. 
 
 
``` 
NODE_MODULES_CACHE  To be determined TODO TODO TODO
SESSION_SECRET  anyRandomStringOfLettersNumbersDigits
NODE_ENV production
```

ONLY set NODE_ENV for production. If unset, it is considered a development/test environment.
