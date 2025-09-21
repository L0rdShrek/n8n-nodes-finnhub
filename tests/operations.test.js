const test = require('node:test');
const assert = require('node:assert/strict');

const { resourceOptions, operationProperties, fieldProperties } = require('../dist/nodes/Finnhub/operations.js');

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
