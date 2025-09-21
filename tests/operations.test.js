const test = require('node:test');
const assert = require('node:assert/strict');

const {
	resourceOptions,
	operationProperties,
	fieldProperties,
} = require('../dist/nodes/Finnhub/operations.js');

const routeDefinitions = require('../nodes/Finnhub/route-definitions.json');

const segmentToResource = {
	stock: 'stock',
	calendar: 'stock',
	search: 'stock',
	news: 'stock',
	'company-news': 'stock',
	'press-releases': 'stock',
	'news-sentiment': 'stock',
	sector: 'stock',
	quote: 'stock',
	ca: 'stock',
	'mutual-fund': 'mutualFund',
	etf: 'etf',
	bond: 'bond',
	forex: 'forex',
	crypto: 'crypto',
	index: 'index',
	scan: 'technical',
	indicator: 'technical',
	institutional: 'institutional',
	economic: 'economic',
	country: 'economic',
	'global-filings': 'enterprise',
	'bank-branch': 'enterprise',
	'ai-chat': 'enterprise',
	'fda-advisory-committee-calendar': 'alternative',
};

const toOperationValue = (route) => {
	const segments = route.replace(/^\/+/, '').split('/');
	const pascal = segments
		.map((segment) =>
			segment
				.replace(/(?<=\D)(\d+)/g, ' $1')
				.split(/[-_/\s]+/)
				.filter(Boolean)
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(''),
		)
		.join('');
	return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : '';
};

function getOperationProperty(resource, hasPremium) {
	return operationProperties.find((property) => {
		const showOptions = property.displayOptions?.show ?? {};
		return (
			property.name === 'operation' &&
			Array.isArray(showOptions.resource) &&
			showOptions.resource.includes(resource) &&
			Array.isArray(showOptions.hasPremium) &&
			showOptions.hasPremium.includes(hasPremium)
		);
	});
}

function getFieldProperty(name) {
	return fieldProperties.find((property) => property.name === name);
}

test('resource options expose free and premium segregations', () => {
	const freeResources = resourceOptions.free.map((option) => option.value);
	const premiumResources = resourceOptions.premium.map((option) => option.value);

	assert.ok(freeResources.includes('stock'), 'stock should be available without premium');
	assert.ok(!freeResources.includes('bond'), 'bond endpoints require premium access');
	assert.ok(premiumResources.includes('bond'), 'premium resource list should include bond');
	assert.ok(new Set(premiumResources).has('stock'), 'premium users keep access to stock resource');
});


test('operations split between premium states for stock resource', () => {
	const freeOperations = getOperationProperty('stock', false);
	const premiumOperations = getOperationProperty('stock', true);

	assert.ok(freeOperations, 'stock resource should expose a free operation list');
	assert.ok(premiumOperations, 'stock resource should expose a premium operation list');

	const freeValues = freeOperations.options.map((option) => option.value);
	const premiumValues = premiumOperations.options.map((option) => option.value);

	assert.ok(freeValues.includes('companyNews'), 'companyNews must remain available to free users');
	assert.ok(!freeValues.includes('stockProfile'), 'stockProfile should be gated behind premium');
	assert.ok(premiumValues.includes('stockProfile'), 'premium list must expose premium-only operations');
});


test('field metadata respects premium visibility', () => {
	const companyNewsSymbol = getFieldProperty('companyNews_symbol');
	assert.ok(companyNewsSymbol, 'companyNews symbol parameter should exist');
	assert.equal(companyNewsSymbol.required, true, 'symbol should be required for companyNews');
	assert.deepEqual(companyNewsSymbol.displayOptions.show.hasPremium.sort(), [false, true], 'companyNews should appear for all tiers');

	const stockProfileSymbol = getFieldProperty('stockProfile_symbol');
	assert.ok(stockProfileSymbol, 'stockProfile symbol parameter should exist');
	assert.equal(stockProfileSymbol.required, false, 'stockProfile symbol parameter should be optional');
	assert.deepEqual(stockProfileSymbol.displayOptions.show.hasPremium, [true], 'stockProfile should only be visible with premium');
});

test('every documented route is represented in operations and fields', () => {
	const fieldNames = new Set(fieldProperties.map((property) => property.name));

	for (const route of routeDefinitions) {
		const [segment] = route.route.replace(/^\/+/, '').split('/');
		const resource = segmentToResource[segment];
		assert.ok(resource, `resource mapping missing for ${route.route}`);

		const operationValue = toOperationValue(route.route);
		const premiumOperations = getOperationProperty(resource, true);
		assert.ok(
			premiumOperations.options.some((option) => option.value === operationValue),
			`${route.route} should be available to premium users`,
		);

		if (!route.premium) {
			const freeOperations = getOperationProperty(resource, false);
			assert.ok(
				freeOperations.options.some((option) => option.value === operationValue),
				`${route.route} should appear for free tier`,
			);
		}

		for (const arg of route.arguments) {
			const fieldName = `${operationValue}_${arg.name}`;
			assert.ok(fieldNames.has(fieldName), `missing field ${fieldName} for ${route.route}`);
			const field = getFieldProperty(fieldName);
			const hasPremiumValues = [...field.displayOptions.show.hasPremium];
			if (route.premium) {
				assert.deepEqual(hasPremiumValues, [true], `${fieldName} should only show for premium`);
			} else {
				hasPremiumValues.sort();
				assert.deepEqual(hasPremiumValues, [false, true], `${fieldName} should be visible for both tiers`);
			}
		}
	}
});


test('operation value duplication stays within premium tiers', () => {
	const seenCombination = new Set();
	const perValue = new Map();

	for (const property of operationProperties) {
		const hasPremium = [...(property.displayOptions?.show?.hasPremium ?? [])].sort();
		const hasPremiumKey = JSON.stringify(hasPremium);

		for (const option of property.options) {
			const comboKey = `${option.value}::${hasPremiumKey}`;
			assert.ok(!seenCombination.has(comboKey), `duplicate operation within the same tier: ${comboKey}`);
			seenCombination.add(comboKey);

			if (!perValue.has(option.value)) perValue.set(option.value, new Set());
			perValue.get(option.value).add(hasPremiumKey);
		}
	}

	for (const [value, tiers] of perValue.entries()) {
		assert.ok(tiers.size <= 2, `operation ${value} should not appear in more than two tier buckets`);
		if (tiers.size === 2) {
			assert.deepEqual([...tiers].sort(), ['[false]', '[true]'], `operation ${value} should only duplicate across free and premium tiers`);
		}
	}
});
