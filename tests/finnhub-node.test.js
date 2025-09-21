const test = require('node:test');
const assert = require('node:assert/strict');

const { Finnhub } = require('../dist/nodes/Finnhub/Finnhub.node.js');
const operations = require('../dist/nodes/Finnhub/operations.js');

function getDisplayKey(property) {
	const show = property.displayOptions?.show ?? {};
	const resource = Array.isArray(show.resource) ? show.resource.join('|') : '';
	const hasPremium = Array.isArray(show.hasPremium) ? show.hasPremium.join('|') : '';
	return `${resource}::${hasPremium}`;
}

test('Finnhub node wires hasPremium toggle to credentials', () => {
	const node = new Finnhub();
	const premiumConfig = node.description.properties.find((property) => property.name === 'hasPremium');
	assert.ok(premiumConfig, 'node must expose a premium toggle');
	assert.equal(
		premiumConfig.default,
		'={{$credentials.finnhub?.premium ?? false}}',
		'premium toggle should default to credential flag',
	);
});


test('Finnhub node resource options align with generated metadata', () => {
	const node = new Finnhub();
	const premiumOptions = node.description.properties
		.filter((property) => property.name === 'resource')
		.filter((property) => property.displayOptions?.show?.hasPremium?.includes(true))
		.flatMap((property) => property.options.map((option) => option.value));

	const generatedPremium = operations.resourceOptions.premium.map((option) => option.value);
	assert.deepEqual(new Set(premiumOptions), new Set(generatedPremium), 'resource lists should be in sync');
});


test('Finnhub node exposes matching operation properties', () => {
	const node = new Finnhub();
	const operationPropertiesInNode = node.description.properties.filter((property) => property.name === 'operation');
	const generated = operations.operationProperties;

	assert.equal(operationPropertiesInNode.length, generated.length, 'operation property count should match generator');

	for (const property of generated) {
		const match = operationPropertiesInNode.find((candidate) => getDisplayKey(candidate) === getDisplayKey(property));
		assert.ok(match, `missing operation property for resource ${property.displayOptions?.show?.resource}`);
		assert.deepEqual(
			match.options.map((option) => option.value).sort(),
			property.options.map((option) => option.value).sort(),
			'node operation options should match generated options',
		);
	}
});
