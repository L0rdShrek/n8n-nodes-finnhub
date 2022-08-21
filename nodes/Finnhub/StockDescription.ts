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
		options: [
			{
				name: 'Symbol Lookup',
				value: 'symbol_lookup',
				description: 'Search for best-matching symbols based on your query. You can input anything from symbol, security\'s name to ISIN and Cusip.',
				action: 'Search for symbols ',
			},
			{
				name: 'Stock Symbol',
				value: 'symbol_stock',
				description: 'List supported stocks. We use the following symbology to identify stocks on Finnhub Exchange_Ticker.Exchange_Code. A list of supported exchange codes can be found <a href="https://docs.google.com/spreadsheets/d/1I3pBxjfXB056-g_JYf_6o3Rns3BV2kMGG1nCatb91ls/edit?usp=sharing">here</a>',
				action: 'Get supported stocks',
			},
		],
		default: 'symbol_lookup',
	},
];

export const stockFields: INodeProperties[] = [
	{
		displayName: 'Symbol Lookup',
		name: 'symbolLookup',
		type: 'string',
		default: '',
		options: [
			{
				name: 'Search Query',
				value: 'q',
			},
		],
		displayOptions: {
			show: {
				operation: ['symbol_Lookup'],
				resource: ['stock'],
			},
		},
		description: 'Search by coin ID or contract address',
		placeholder: 'apple',
	},
	{
		displayName: 'Stock Symbol',
		name: 'stockSymbol',
		type: 'string',
		options: [
			{
				name: 'Exchange',
				value: 'exchange',
			},
		],
		displayOptions: {
			show: {
				operation: ['symbol_stock'],
				resource: ['stock'],
			},
		},
		default: 'US',
		description: 'Search by coin ID or contract address',
		placeholder: 'apple',
	},






];
