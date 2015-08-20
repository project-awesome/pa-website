# Setting up Travis CI

If you're not familiar with [Travis CI](https://travis-ci.org) and [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration), you can try reading [Travis CI for Complete Beginners](http://docs.travis-ci.com/user/for-beginners/) first.

### To get started with Travis CI:

1. [Sign in to Travis CI](https://travis-ci.org/auth) with your GitHub account, and accept the GitHub access permissions confirmation.
2. Once you're signed in, and your repositories from GitHub are synced, go to your [profile page](https://travis-ci.org/profile) and enable Travis CI for the repository you want to build. 
3. The .travis.yml should already be present in your repo. Now when you run `git push origin master` from the command line, it should trigger a Travis CI build.

More details can be found [here](http://docs.travis-ci.com/user/getting-started/).

### Setting the environment variables:

**Note** that your build with fail unless you first set up your Travis CI environment variables in your Travis CI repository settings.

To define variables in Repository Settings, make sure you're logged in, navigate to the repository in question, choose "Settings" from the cog menu, and click on "Add new variable" in the "Environment Variables" section.

![Travis CI Repository Settings](http://docs.travis-ci.com/images/settings-env-vars.png)

By default, the value of these new environment variables is hidden from the `export` line in the logs.

The environment variables you need are:

* SAUCE_ACCESS_KEY
* SAUCE_USERNAME
* DATABASE_URL (to postgres://postgres@localhost/tcidb)
* FACEBOOK_APP_ID
* FACEBOOK_APP_SECRET
* FACEBOOK_CALLBACK_URL
* FACEBOOK_TEST_EMAIL
* FACEBOOK_TEST_PASSWORD
* GOOGLE_APP_ID
* GOOGLE_APP_SECRET
* GOOGLE_CALLBACK_URL
* GOOGLE_TEST_EMAIL
* GOOGLE_TEST_PASSWORD

### Creating a Sauce Labs account

You need to create a Sauce Labs account and provide Travis CI with your username and access key. The directions can be found [here](/HOWTO-SELENIUM.md) under "Creating a Sauce Labs account".












