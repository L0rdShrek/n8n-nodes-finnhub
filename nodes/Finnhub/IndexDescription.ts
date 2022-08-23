import { INodeProperties } from 'n8n-workflow';

export const indexOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['index'],
			},
		},
		options: [
			{
				name: 'Indices Constituents',
				value: 'indicesConstituents',
				description:
					'Get a list of index\'s constituents. A list of supported indices for this endpoint can be found <a href="https://docs.google.com/spreadsheets/d/1Syr2eLielHWsorxkDEZXyc55d6bNx1M3ZeI4vdn7Qzo/edit?usp=sharing">here</a>.',
				action: 'Lookup for symbols',
				routing: {
					request: {
						method: 'GET',
						url: '/index/constituents',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'Indices Historical Constituents [PREMIUM]',
				value: 'indicesHistoricalConstituents',
				description:
					"Get full history of index's constituents including symbols and dates of joining and leaving the Index. Currently support ^GSPC, ^NDX, ^DJI.",
				action: 'Lookup for symbols',
				routing: {
					request: {
						method: 'GET',
						url: '/index/historical-constituents',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
		],
		default: 'indicesConstituents',
	},
];

export const indexFields: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['indicesConstituents', 'indicesHistoricalConstituents'],
				resource: ['index'],
			},
		},
		default: '^GSPC',
		description: 'Search by Symbol for a company profile',
		placeholder: '^GSPC',
	},
];
