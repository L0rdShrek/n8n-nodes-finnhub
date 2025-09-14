![Component palette with Finnhub Node](https://raw.githubusercontent.com/L0rdShrek/n8n-nodes-finnhub/master/docs/logo.png)

<h1 align="center">
  🛠 Finnhub.io REST API node for <code>n8n</code>
</h1>
<p align="center">
	This is an n8n community node. It lets you use _finnhub.io_ in your n8n workflows.
	<br />
	<br />
	finnhub.io is a Real-Time RESTful APIs and Websocket for Stocks, Currencies, and Crypto.  
	<br />
	Access real-time stock API, institutional-grade fundamental and alternative data to supercharge your investment for FREE.
</p>

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.


[Installation](#installation)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Operations](#operations)  
[Resources](#resources)  
<!--[Version history](#version-history) -->  
[Development](#development)  

## Installation
Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials
You need to create a Finnhub.io credential to use this node. Get your [free API key](https://finnhub.io/dashboard) for Finnhub Stock API.  
Tipp: Add Credentials with your real Token and a Sandbox Token [to try Premium Operation].

## Compatibility

- n8n: v1.x
- Node.js (zum Bauen dieses Pakets): 18+ (getestet mit 18/20/22)

## Usage

Add the node to your workflow and and get data from the finnhub.io REST API.

![Component palette with Finnhub Node](https://raw.githubusercontent.com/L0rdShrek/n8n-nodes-finnhub/master/docs/component.png)

![Node options in workflow](https://raw.githubusercontent.com/L0rdShrek/n8n-nodes-finnhub/master/docs/node.png)

## Operations
* [Stock Fundamentals](https://finnhub.io/docs/api/symbol-search)
* [Stock Estimates](https://finnhub.io/docs/api/recommendation-trends)
* [Stock Price](https://finnhub.io/docs/api/quote)
* [ETFs & Indices](https://finnhub.io/docs/api/indices-constituents)
* [Mutual Funds](https://finnhub.io/docs/api/symbol-search)
<!--* [Bonds](https://finnhub.io/docs/api/bond-profile) comming soon-->
* [Forex](https://finnhub.io/docs/api/forex-exchanges)
* [Crypto](https://finnhub.io/docs/api/crypto-exchanges)
* [Technical Analysis](https://finnhub.io/docs/api/pattern-recognition)
* [Alternative Data](https://finnhub.io/docs/api/transcripts-list)
* [Economic](https://finnhub.io/docs/api/country)
## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Finnhub API Documentation](https://finnhub.io/docs/api)

## Development

Für lokale Entwicklung und Beiträge:

- Voraussetzungen
  - Node.js 18+ und npm
  - TypeScript 5, ESLint 8, Prettier 3 (werden als Dev-Dependencies installiert)

- Nützliche Skripte
  - `npm run build` – kompiliert TypeScript und kopiert Icons (Gulp v5)
  - `npm run dev` – TypeScript im Watch-Modus
  - `npm run lint` – lintet mit ESLint und den n8n-Nodes-Base-Regeln
  - `npm run lintfix` – wie oben, aber mit automatischen Fixes
  - `npm run format` – formatiert mit Prettier

- Hinweise
  - Dieses Paket verwendet ESLint (TSLint ist entfernt).
  - Der TypeScript-Compiler ist auf `skipLibCheck` konfiguriert, um fehlerhafte Typdefinitionen externer Abhängigkeiten zu ignorieren.
  - Sicherheitsrelevante Unterabhängigkeiten werden bei Bedarf über `package.json` → `overrides` erzwungen (z. B. für `axios` und `form-data`).

## Version history

* 0.2.0
  - Dependencies aktualisiert: TypeScript 5, Prettier 3, ESLint (TSLint entfernt)
  - n8n-Pakete auf v1.x gehoben; Node-Inputs/Outputs an neue Typen angepasst
  - Gulp auf v5 aktualisiert
  - Security-Overrides für axios und form-data hinzugefügt
  - README und Dev-Hinweise ergänzt

