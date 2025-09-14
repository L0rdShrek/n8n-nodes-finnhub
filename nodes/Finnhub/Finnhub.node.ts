/* eslint-disable n8n-nodes-base/node-class-description-credentials-name-unsuffixed */
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeInputConfiguration,
	INodeOutputConfiguration,
} from 'n8n-workflow';

import { stockFields, stockOperations } from './StockDescription';
import { indexFields, indexOperations } from './IndexDescription';
import { etfFields, etfOperations } from './ETFDescription';
import { forexFields, forexOperations } from './ForexDescription';
import { cryptoFields, cryptoOperations } from './CryptoDescription';
import { alternativeFields, alternativeOperations } from './AlternativeDescription';

export class Finnhub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Finnhub.io',
		name: 'finnhub',
		icon: 'file:finnhub.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Finnhub.io API',
		defaults: {
			name: 'Finnhub',
		},
		inputs: ['main'] as unknown as Array<NodeConnectionType | INodeInputConfiguration>,
		outputs: ['main'] as unknown as Array<NodeConnectionType | INodeOutputConfiguration>,
		credentials: [
			{
				name: 'finnhub',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://finnhub.io/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Stock',
						value: 'stock',
					},
					{
						name: 'Index',
						value: 'index',
					},
					{
						name: 'ETF',
						value: 'etf',
					},
					{
						name: 'Forex',
						value: 'forex',
					},
					{
						name: 'Crypto',
						value: 'crypto',
					},
					{
						name: 'Alternative',
						value: 'alternative',
					},
				],
				default: 'stock',
			},
			...stockOperations,
			...stockFields,

			...indexOperations,
			...indexFields,

			...etfOperations,
			...etfFields,

			...forexOperations,
			...forexFields,

			...cryptoOperations,
			...cryptoFields,

			...alternativeOperations,
			...alternativeFields,
		],
	};

	methods = {
		loadOptions: {},
	};
}
