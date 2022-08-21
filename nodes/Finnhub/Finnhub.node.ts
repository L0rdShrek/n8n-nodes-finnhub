import { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { stockFields, stockOperations } from './StockDescription';

import { finnhubApiRequest, finnhubRequestAllItems } from './GenericFunctions';

export class Finnhub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Finnhub.io',
		name: 'finnhub',
		icon: 'file:httpbin.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Finnhub.io API',
		defaults: {
			name: 'Finnhub',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'finnhubApi',
				required: true,
			},
		],
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 *
		 * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
		 * to keep this class easy to read.
		 *
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Stock',
						value: 'stock',
					},
				],

				...stockOperations,
				...stockFields,


				default: 'stock',
			},
		],
	};
}
