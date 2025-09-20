import { IHttpRequestMethods, INodeProperties } from 'n8n-workflow';

import rawRouteDefinitions from './route-definitions.json';

type RouteDefinition = {
	method: string;
	route: string;
	premium: boolean;
	arguments: Array<{
		name: string;
		required: boolean;
		description: string;
	}>;
};

type ResourceName =
	| 'stock'
	| 'mutualFund'
	| 'etf'
	| 'bond'
	| 'forex'
	| 'crypto'
	| 'index'
	| 'technical'
	| 'institutional'
	| 'economic'
	| 'enterprise'
	| 'alternative';

type EnhancedRouteDefinition = RouteDefinition & {
	resource: ResourceName;
	opValue: string;
	displayName: string;
};

const segmentToResource: Record<string, ResourceName> = {
	stock: 'stock',
	calendar: 'stock',
	search: 'stock',
	news: 'stock',
	'company-news': 'stock',
	'press-releases': 'stock',
	'news-sentiment': 'stock',
	sector: 'stock',
	quote: 'stock',
	ca: 'stock',
	'mutual-fund': 'mutualFund',
	etf: 'etf',
	bond: 'bond',
	forex: 'forex',
	crypto: 'crypto',
	index: 'index',
	scan: 'technical',
	indicator: 'technical',
	institutional: 'institutional',
	economic: 'economic',
	country: 'economic',
	'global-filings': 'enterprise',
	'bank-branch': 'enterprise',
	'ai-chat': 'enterprise',
	'fda-advisory-committee-calendar': 'alternative',
};

const resourceDisplayNames: Record<ResourceName, string> = {
	stock: 'Stock',
	mutualFund: 'Mutual Fund',
	etf: 'ETF',
	bond: 'Bond',
	forex: 'Forex',
	crypto: 'Crypto',
	index: 'Index',
	technical: 'Technical Analysis',
	institutional: 'Institutional Data',
	economic: 'Economic Data',
	enterprise: 'Enterprise Data',
	alternative: 'Alternative Data',
};

function pascalCaseSegment(segment: string): string {
	return segment
		.replace(/(?<=\D)(\d+)/g, ' $1')
		.split(/[-_/\s]+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

function toOperationValue(route: string): string {
	const segments = route.replace(/^\/+/, '').split('/');
	const pascal = segments.map(pascalCaseSegment).join('');
	return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : '';
}

function toDisplayName(route: string): string {
	const segments = route.replace(/^\/+/, '').split('/');
	return segments
		.map((segment) =>
			segment
				.replace(/(?<=\D)(\d+)/g, ' $1')
				.split(/[-_/\s]+/)
				.filter(Boolean)
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' '),
		)
		.join(' ')
		.trim();
}

function toFieldDisplayName(parameterName: string): string {
	return parameterName
		.replace(/_/g, ' ')
		.replace(/(?<=\D)(\d+)/g, ' $1')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

const rawRoutes: RouteDefinition[] = rawRouteDefinitions as RouteDefinition[];

const enhancedRoutes: EnhancedRouteDefinition[] = rawRoutes
	.map((routeDef) => {
		const segments = routeDef.route.replace(/^\/+/, '').split('/');
		const segment = segments[0];
		const resource = segmentToResource[segment];
		if (!resource) {
			throw new Error(`No resource mapping found for segment "${segment}" in route ${routeDef.route}`);
		}
		return {
			...routeDef,
			resource,
			opValue: toOperationValue(routeDef.route),
			displayName: toDisplayName(routeDef.route) || routeDef.route,
		};
	})
	.sort((a, b) => a.displayName.localeCompare(b.displayName));

const operationsByResource = enhancedRoutes.reduce(
	(acc, route) => {
		if (!acc[route.resource]) {
			acc[route.resource] = [];
		}
		acc[route.resource].push(route);
		return acc;
	},
	{} as Record<ResourceName, EnhancedRouteDefinition[]>,
);

const resourceNames = Object.keys(operationsByResource) as ResourceName[];

const freeResourceOptions = resourceNames
	.filter((resource) => operationsByResource[resource].some((route) => !route.premium))
	.sort((a, b) => resourceDisplayNames[a].localeCompare(resourceDisplayNames[b]))
	.map((resource) => ({ name: resourceDisplayNames[resource], value: resource }));

const premiumResourceOptions = resourceNames
	.sort((a, b) => resourceDisplayNames[a].localeCompare(resourceDisplayNames[b]))
	.map((resource) => ({ name: resourceDisplayNames[resource], value: resource }));

function buildOptions(routes: EnhancedRouteDefinition[], includePremium: boolean) {
	return routes
		.filter((route) => includePremium || !route.premium)
		.sort((a, b) => a.displayName.localeCompare(b.displayName))
		.map((route) => ({
			name: route.premium ? `${route.displayName} (Premium)` : route.displayName,
			value: route.opValue,
			description: `Call ${route.route}`,
			action: `Call ${route.displayName}`,
			routing: {
				request: {
					method: route.method as IHttpRequestMethods,
					url: route.route,
					qs: route.arguments.reduce<Record<string, string>>((acc, arg) => {
						acc[arg.name] = `={{$parameter["${route.opValue}_${arg.name}"]${arg.required ? '' : ' || undefined'}}}`;
						return acc;
					}, {}),
				},
			},
		}));
}

const operationProperties: INodeProperties[] = [];
const fieldProperties: INodeProperties[] = [];

for (const resource of resourceNames) {
	const routes = operationsByResource[resource].sort((a, b) => a.displayName.localeCompare(b.displayName));

	const freeOptions = buildOptions(routes, false);
	const premiumOptions = buildOptions(routes, true);

	if (freeOptions.length > 0) {
		operationProperties.push({
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: {
				show: {
					hasPremium: [false],
					resource: [resource],
				},
			},
			options: freeOptions,
			default: freeOptions[0].value,
		});
	}

	operationProperties.push({
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				hasPremium: [true],
				resource: [resource],
			},
		},
		options: premiumOptions,
		default: premiumOptions[0]?.value ?? '',
	});

	for (const route of routes) {
	const hasPremiumValues = route.premium ? [true] : [true, false];
		for (const arg of route.arguments) {
			fieldProperties.push({
				displayName: toFieldDisplayName(arg.name),
				name: `${route.opValue}_${arg.name}`,
				type: 'string',
				required: arg.required,
				description: arg.description || `Query parameter ${arg.name}.`,
				default: '',
				displayOptions: {
					show: {
						hasPremium: hasPremiumValues,
						resource: [resource],
						operation: [route.opValue],
					},
				},
			});
		}
	}
}

export const resourceOptions = {
	free: freeResourceOptions,
	premium: premiumResourceOptions,
};

export { operationProperties, fieldProperties };
