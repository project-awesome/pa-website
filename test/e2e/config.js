exports.config = {
	specs:['env_vars.js', 'navigation.js', 'routing.js', 'pages/*.js'],
	baseUrl: 'http://localhost:5000',
	framework:'mocha',
	mochaOpts: {
		reporter:'spec',
		slow: 3000,
		enableTimeouts: false
	},
	capabilities: {
		'browserName':'chrome'
	}
};

if (process.env.TRAVIS_BUILD_NUMBER) {
    exports.config.seleniumAddress = 'http://localhost:4445/wd/hub';
    exports.config.capabilities = {
        'name': 'Travis + Protractor Tests',
        'browserName': 'chrome',
        'username': process.env.SAUCE_USERNAME,
        'accessKey': process.env.SAUCE_ACCESS_KEY,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'tags': [process.env.TRAVIS_BRANCH, process.env.TRAVIS_BUILD_NUMBER]
    };
}