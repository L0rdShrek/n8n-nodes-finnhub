import { INodeProperties } from 'n8n-workflow';

export const etfOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['etf'],
			},
		},
		options: [
			{
				name: 'ETFs Profile [PREMIUM]',
				value: 'etfProfile',
				description: 'Get ETF profile information. This endpoint has global coverage.',
				action: 'Get ETF profile information',
				routing: {
					request: {
						method: 'GET',
						url: '/etf/profile',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'ETFs Holdings [PREMIUM]',
				value: 'etfsHoldings',
				description: 'Get full ETF holdings/constituents. This endpoint has global coverage.',
				action: 'Get ETF holdings',
				routing: {
					request: {
						method: 'GET',
						url: '/etf/holdings',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'ETFs Sector Exposure [PREMIUM]',
				value: 'etfsSectorExposure',
				description: 'Get ETF sector exposure data',
				action: 'Get etf sector exposure data',
				routing: {
					request: {
						method: 'GET',
						url: '/etf/sector',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'ETFs Country Exposure [PREMIUM]',
				value: 'etfsCountryExposure',
				description: 'Get ETF sector exposure data',
				action: 'Get etf sector exposure data',
				routing: {
					request: {
						method: 'GET',
						url: '/etf/country',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
		],
		default: 'etfProfile',
	},
];

export const etfFields: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['etfProfile', 'etfsHoldings', 'etfsSectorExposure', 'etfsCountryExposure'],
				resource: ['etf'],
			},
		},
		default: 'ARKK',
		description: 'ETF symbol',
		placeholder: 'ARKK',
	},
];
