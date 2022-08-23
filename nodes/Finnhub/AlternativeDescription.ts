import { INodeProperties } from 'n8n-workflow';

export const alternativeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alternative'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Social Sentiment',
				value: 'socialSentiment',
				description: 'Get social sentiment for stocks on Reddit and Twitter',
				action: 'Get social sentiment',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/social-sentiment',
						qs: {
							symbol: '={{$parameter.symbol}}'
						}
					}
				}
			},
			{
				name: 'USPTO Patents',
				value: 'usptoPatents',
				description: 'List USPTO patents for companies',
				action: 'List USPTO patents',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/uspto-patent',
						qs: {
							symbol: '={{$parameter.symbol}}',
							from: '={{new Date($parameter.fromDate).toISOString().substr(0,10)}}',
							to: '={{new Date($parameter.toDate).toISOString().substr(0,10)}}'
						}
					}
				}
			},
			{
				name: 'H1-B Visa Application',
				value: 'visa-application',
				description: 'Get a list of H1-B and Permanent visa applications for companies from the DOL',
				action: 'Get a list of h1 b and permanent visa applications',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/visa-application',
						qs: {
							symbol: '={{$parameter.symbol}}',
							from: '={{new Date($parameter.fromDate).toISOString().substr(0,10)}}',
							to: '={{new Date($parameter.toDate).toISOString().substr(0,10)}}'
						}
					}
				}
			},
			{
				name: 'Senate Lobbying',
				value: 'lobbying',
				description: 'Get a list of reported lobbying activities in the Senate and the House',
				action: 'Get a list of reported lobbying activities',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/lobbying',
						qs: {
							symbol: '={{$parameter.symbol}}',
							from: '={{new Date($parameter.fromDate).toISOString().substr(0,10)}}',
							to: '={{new Date($parameter.toDate).toISOString().substr(0,10)}}'
						}
					}
				}
			},
			{
				name: 'USA Spending',
				value: 'usaSpending',
				description: 'Get a list of government\'s spending activities from USASpending dataset for public companies',
				action: 'Get a list of government spending activities',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/usa-spending',
						qs: {
							symbol: '={{$parameter.symbol}}',
							from: '={{new Date($parameter.fromDate).toISOString().substr(0,10)}}',
							to: '={{new Date($parameter.toDate).toISOString().substr(0,10)}}'
						}
					}
				}
			},
			{
				name: 'FDA Committee Meeting Calendar',
				value: 'fda',
				description: 'Get a list of reported lobbying activities in the Senate and the House',
				action: 'Get a list of reported lobbying activities',
				routing: {
					request: {
						method: 'GET',
						url: '/fda-advisory-committee-calendar',
					}
				}
			},

		],
		default: 'socialSentiment',
	},
];

export const alternativeFields: INodeProperties[] = [
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['socialSentiment', 'usptoPatents', 'visa-application', 'lobbying', 'usaSpending'],
				resource: ['alternative'],
			},
		},
		default: 'GME',
		description: 'Company symbol',
		placeholder: 'GME',
	},
	{
		displayName: 'From Date',
		name: 'fromDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['usptoPatents', 'visa-application', 'lobbying', 'usaSpending'],
				resource: ['alternative'],
			},
		},
		default: '2021-01-01',
	},
	{
		displayName: 'To Date',
		name: 'toDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['usptoPatents', 'visa-application', 'lobbying', 'usaSpending'],
				resource: ['alternative'],
			},
		},
		default: '2021-12-31',
	},
];
