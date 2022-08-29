/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import { INodeProperties } from 'n8n-workflow';

export const stockOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['stock'],
			},
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: 'Symbol Lookup',
				value: 'symbolLookup',
				description:
					"Search for best-matching symbols based on your query. You can input anything from symbol, security's name to ISIN and Cusip.",
				action: 'Lookup for symbols',
				routing: {
					request: {
						method: 'GET',
						url: '/search',
						qs: {
							q: '={{$parameter.symbolLookup}}',
						},
					},
				},
			},
			{
				name: 'Stock Symbol',
				value: 'symbolStock',
				description:
					'List supported stocks. We use the following symbology to identify stocks on Finnhub Exchange_Ticker.Exchange_Code. A list of supported exchange codes can be found <a href="https://docs.google.com/spreadsheets/d/1I3pBxjfXB056-g_JYf_6o3Rns3BV2kMGG1nCatb91ls/edit?usp=sharing">here</a>',
				action: 'Get supported stocks',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/symbol',
						qs: {
							exchange: '={{$parameter.exchange}}',
							mic: '={{$parameter.mic}}',
							securityType: '={{$parameter.securityType}}',
							currency: '={{$parameter.currency}}',
						},
					},
				},
			},
			{
				name: 'Company Profile [PREMIUM]',
				value: 'companyProfile',
				description: 'Get general information of a company',
				action: 'Get company profile',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/profile',
						qs: {
							symbol: '={{$parameter.symbol}}',
							isin: '={{$parameter.isin}}',
							cusip: '={{$parameter.cusip}}',
						},
					},
				},
			},
			{
				name: 'Company Profile 2',
				value: 'companyProfile2',
				description: 'Get general information of a company',
				action: 'Get company profile',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/profile2',
						qs: {
							symbol: '={{$parameter.symbol}}',
							isin: '={{$parameter.isin}}',
							cusip: '={{$parameter.cusip}}',
						},
					},
				},
			},
			{
				name: 'Company Executive [PREMIUM]',
				value: 'companyExecutive',
				description: 'Get a list of company\'s executives and members of the Board',
				action: 'Get company executive',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/executive',
						qs: {
							symbol: '={{$parameter.symbolRequired}}',
						},
					},
				},
			},
			{
				name: 'Market News',
				value: 'marketNews',
				description: 'Get latest market news',
				action: 'Get latest market news',
				routing: {
					request: {
						method: 'GET',
						url: '/news',
						qs: {
							category: '={{$parameter.category}}',
							minId: '={{$parameter.minId}}',
						},
					},
				},
			},
			{
				name: 'Company News',
				value: 'companyNews',
				description: 'List latest company news by symbol. This endpoint is only available for North American companies.',
				action: 'List latest company news',
				routing: {
					request: {
						method: 'GET',
						url: '/company-news',
						qs: {
							symbol: '={{$parameter.symbolRequired}}',
							from: '={{$parameter.fromDateRequired}}',
							to: '={{$parameter.toDateRequired}}',
						},
					},
				},
			},
			{
				name: 'Major Press Releases [PREMIUM]',
				value: 'majorPressReleases',
				description: 'Get latest major press releases of a company. This data can be used to highlight the most significant events comprised of mostly press releases sourced from the exchanges, BusinessWire, AccessWire, GlobeNewswire, Newsfile, and PRNewswire.',
				action: 'Get latest major press releases of a company',
				routing: {
					request: {
						method: 'GET',
						url: '/company-news',
						qs: {
							symbol: '={{$parameter.symbolRequired}}',
							from: '={{$parameter.fromDate}}',
							to: '={{$parameter.toDate}}',
						},
					},
				},
			},

			{
				name: 'News Sentiment [PREMIUM]',
				value: 'newsSentiment',
				description: 'Get company\'s news sentiment and statistics. This endpoint is only available for US companies.',
				action: 'Get company news sentiment and statistics',
				routing: {
					request: {
						method: 'GET',
						url: '/company-news',
						qs: {
							symbol: '={{$parameter.symbolRequired}}',
						},
					},
				},
			},


			{
				name: 'Peers',
				value: 'peers',
				description: 'Get company peers',
				action: 'Get company peers',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/peers',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'Basic Financials',
				value: 'basicFinancials',
				description: 'Get company basic financials such as margin, P/E ratio, 52-week high/low etc',
				action: 'Get company basic financials',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/metric',
						qs: {
							symbol: '={{$parameter.symbol}}',
							metric: 'all',
						},
					},
				},
			},
			{
				name: 'Recommendation Trends',
				value: 'recommendationTrends',
				description: 'Get latest analyst recommendation trends for a company',
				action: 'Get latest analyst recommendation trends',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/recommendation',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'Price Target [PREMIUM]',
				value: 'priceTarget',
				description: 'Get latest price target consensus',
				action: 'Get latest price target consensus',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/price-target',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'Earnings Surprises',
				value: 'earningsSurprises',
				description: 'Get company historical quarterly earnings surprise going back to 2000',
				action: 'Get company quarterly earnings surprise',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/earnings',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'Quote',
				value: 'quote',
				description: 'Get real-time quote data for US stocks',
				action: 'Get real time quote data for us stocks',
				routing: {
					request: {
						method: 'GET',
						url: '/quote',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'Last Bid-Ask [PREMIUM]',
				value: 'lastBidAsk',
				description: 'Get last bid/ask data for US stocks',
				action: 'Get last bid ask data for US stocks',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/bidask',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
			{
				name: 'Dividends 2 (Basic) [PREMIUM]',
				value: 'dividends2',
				description: 'Get global dividends data',
				action: 'Get global dividends data',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/dividend2',
						qs: {
							symbol: '={{$parameter.symbol}}',
						},
					},
				},
			},
		],
		default: 'symbolLookup',
	},
];

export const stockFields: INodeProperties[] = [
	{
		displayName: 'Symbol Lookup',
		name: 'symbolLookup',
		required: true,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['symbolLookup'],
				resource: ['stock'],
			},
		},
		description: 'Search by coin ID or contract address',
		placeholder: 'apple',
	},
	{
		displayName: 'Exchange',
		name: 'exchange',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				operation: ['symbolStock'],
				resource: ['stock'],
			},
		},
		default: 'US',
		description: 'Search by coin ID or contract address',
		placeholder: 'US',
	},
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'companyProfile',
					'companyProfile2',
					'peers',
					'basicFinancials',
					'recommendationTrends',
					'priceTarget',
					'earningsSurprises',
					'quote',
					'lastBidAsk',
					'dividends2',
				],
				resource: ['stock'],
			},
		},
		default: 'AAPL',
		description: 'Search by Symbol for a company profile',
		placeholder: 'AAPL',
	},
	{
		displayName: 'Symbol',
		name: 'symbolRequired',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'companyExecutive', 'companyNews', 'newsSentiment'
				],
				resource: ['stock'],
			},
		},
		default: 'AAPL',
		description: 'Search by Symbol for a company profile',
		placeholder: 'AAPL',
	},
	{
		displayName: 'MIC Code',
		name: 'mic',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['symbolStock',],
				resource: ['stock'],
			},
		},
		default: '',
		description: 'Filter by MIC code',
		placeholder: 'XNYS',
	},
	{
		displayName: 'securityType',
		name: 'securityType',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['symbolStock',],
				resource: ['stock'],
			},
		},
		default: '',
		description: 'Filter by security type used by OpenFigi standard',
		placeholder: 'securityType',
	},
	{
		displayName: 'currency',
		name: 'currency',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['symbolStock',],
				resource: ['stock'],
			},
		},
		default: '',
		description: 'Filter by currency',
		placeholder: 'currency',
	},
	{
		displayName: 'isin',
		name: 'isin',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['companyProfile','companyProfile2',],
				resource: ['stock'],
			},
		},
		default: '',
		description: 'International Securities Identification Number',
		placeholder: 'US5949181045',
	},
	{
		displayName: 'cusip',
		name: 'cusip',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['companyProfile','companyProfile2',],
				resource: ['stock'],
			},
		},
		default: '',
		description: 'Committee on Uniform Security Identification Procedure',
		placeholder: '023135106',
	},
	{
		displayName: 'Category',
		name: 'category',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['marketNews',],
				resource: ['stock'],
			},
		},
		options: [
			{
				name: 'General',
				value: 'general',
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
				name: 'Merger',
				value: 'merger',
			},
		],
		default: 'general',
		description: 'Committee on Uniform Security Identification Procedure',
		placeholder: '023135106',
	},
	{
		displayName: 'minId',
		name: 'minId',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['marketNews',],
				resource: ['stock'],
			},
		},
		typeOptions: {
			minValue: 0,
			numberStepSize: 1,
		},
		default: 0,
		description: 'Use this field to get only news after this ID',
		placeholder: '1337',
	},

	{
		displayName: 'From Date',
		name: 'fromDateRequired',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['companyNews',],
				resource: ['stock'],
			},
		},
		default: '2021-01-01',
	},
	{
		displayName: 'To Date',
		name: 'toDateRequired',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				operation: ['companyNews',],
				resource: ['stock'],
			},
		},
		default: '2021-12-31',
	},
	{
		displayName: 'From Date',
		name: 'fromDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				operation: ['majorPressReleases',],
				resource: ['stock'],
			},
		},
		default: '2021-01-01',
	},
	{
		displayName: 'To Date',
		name: 'toDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				operation: ['majorPressReleases',],
				resource: ['stock'],
			},
		},
		default: '2021-12-31',
	},

];
