import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FinnhubApi implements ICredentialType {
	name = 'finnhubApi';
	displayName = 'Finnhub.io API';
	documentationUrl = 'https://finnhub.io/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
		},
	];
	authenticate = {
		type: 'generic',
		properties: {
			headers: {
				'X-Finnhub-Token': '={{$credentials.token}}',
			},
		},
	} as IAuthenticateGeneric;

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://finnhub.io/api/v1',
			url: '/',
		},
	};
}
