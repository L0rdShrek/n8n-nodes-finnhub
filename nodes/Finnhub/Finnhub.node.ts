/* eslint-disable n8n-nodes-base/node-class-description-credentials-name-unsuffixed */
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeInputConfiguration,
	INodeOutputConfiguration,
} from 'n8n-workflow';

import { fieldProperties, operationProperties, resourceOptions } from './operations';

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
				displayName: 'Premium Access',
				name: 'hasPremium',
				type: 'boolean',
				default: '={{$credentials.finnhub?.premium ?? false}}',
				description: 'Toggle premium Finnhub endpoints based on your credential.',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						hasPremium: [false],
					},
				},
				options: resourceOptions.free,
				default: resourceOptions.free[0]?.value ?? '',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						hasPremium: [true],
					},
				},
				options: resourceOptions.premium,
				default: resourceOptions.premium[0]?.value ?? '',
			},
			...operationProperties,
			...fieldProperties,
		],
	};

	methods = {
		loadOptions: {},
	};
}
