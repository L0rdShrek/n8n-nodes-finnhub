const test = require('node:test');
const assert = require('node:assert/strict');

const routes = require('../nodes/Finnhub/route-definitions.json');

test('route definitions stay unique and well-formed', () => {
	assert.ok(Array.isArray(routes) && routes.length > 0, 'route definitions must not be empty');
	const unique = new Set();
	let premiumCount = 0;
	for (const entry of routes) {
		assert.ok(entry.route.startsWith('/'), `route ${entry.route} should start with /`);
		const key = `${entry.method}::${entry.route}`;
		assert.ok(!unique.has(key), `duplicate route detected: ${key}`);
		unique.add(key);
		if (entry.premium) premiumCount += 1;
	}
	assert.ok(premiumCount > 0, 'premium endpoints should be represented in the metadata');
});


 test('routes include argument metadata when required', () => {
	const companyNews = routes.find((entry) => entry.route === '/company-news');
	assert.ok(companyNews, 'company news endpoint should exist');
	const requiredArgs = companyNews.arguments.filter((arg) => arg.required).map((arg) => arg.name);
	assert.deepEqual(requiredArgs.sort(), ['from', 'symbol', 'to'], 'company news requires symbol, from and to parameters');
});
