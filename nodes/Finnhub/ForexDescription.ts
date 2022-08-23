import { INodeProperties } from 'n8n-workflow';

export const forexOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['forex'],
			},
		},
		options: [
			{
				name: 'Forex Exchanges',
				value: 'forexExchanges',
				description: 'List supported forex exchanges',
				action: 'List supported forex exchanges',
				routing: {
					request: {
						method: 'GET',
						url: '/forex/exchange',
					}
				}
			},
			{
				name: 'Forex Symbol',
				value: 'forexSymbol',
				description: 'List supported forex symbols',
				action: 'List supported forex symbols',
				routing: {
					request: {
						method: 'GET',
						url: '/forex/symbol',
						qs: {
							exchange: '={{$parameter.exchange}}'
						}
					}
				}
			},
			{
				name: 'Forex Rates [PREMIUM]',
				value: 'forexRates',
				description: 'Get rates for all forex pairs. Ideal for currency conversion.',
				action: 'Get rates for all forex pairs ideal for currency conversion',
				routing: {
					request: {
						method: 'GET',
						url: '/forex/rates',
						qs: {
							base: '={{$parameter.base}}'
						}
					}
				}
			},

		],
		default: 'forexExchanges',
	},
];

export const forexFields: INodeProperties[] = [
	{
		displayName: 'Exchange',
		name: 'exchange',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['forexSymbol'],
				resource: ['forex'],
			},
		},
		default: 'oanda',
		description: 'Exchange you want to get the list of symbols from',
		placeholder: 'oanda',
	},
	{
		displayName: 'Base',
		name: 'base',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['forexRates'],
				resource: ['forex'],
			},
		},
		default: 'USD',
		description: 'Base currency. Default to EUR.',
		placeholder: 'USD',
	},
];
