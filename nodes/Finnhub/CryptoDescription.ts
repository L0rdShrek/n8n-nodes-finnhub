import { INodeProperties } from 'n8n-workflow';

export const cryptoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['crypto'],
			},
		},
		options: [
			{
				name: 'Crypto Exchanges',
				value: 'cryptoExchanges',
				description: 'List supported crypto exchanges',
				action: 'List supported crypto exchanges',
				routing: {
					request: {
						method: 'GET',
						url: '/crypto/exchange',
					},
				},
			},
			{
				name: 'Crypto Symbol',
				value: 'cryptoSymbol',
				description: 'List supported crypto symbols by exchange',
				action: 'List supported crypto symbols by exchange',
				routing: {
					request: {
						method: 'GET',
						url: '/crypto/symbol',
						qs: {
							exchange: '={{$parameter.exchange}}',
						},
					},
				},
			},
		],
		default: 'cryptoExchanges',
	},
];

export const cryptoFields: INodeProperties[] = [
	{
		displayName: 'Exchange',
		name: 'exchange',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['cryptoSymbol'],
				resource: ['crypto'],
			},
		},
		default: 'binance',
		description: 'Exchange you want to get the list of symbols from',
		placeholder: 'binance',
	},
];
