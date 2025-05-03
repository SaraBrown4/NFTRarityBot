# NFT Rarity Bot

A Node.js bot that analyzes NFT collections and calculates rarity scores based on metadata and traits.

## Features

- Fetch NFT metadata from various sources
- Calculate rarity scores based on trait distribution
- Support for multiple NFT collections
- Export rarity data to JSON

## Installation

```bash
npm install
```

## Usage

### Command Line Interface

```bash
# Analyze a collection
npm run analyze 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb

# Generate detailed report
npm run report 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d --export

# Show help
node cli.js help
```

### Programmatic Usage

```javascript
const NFTRarityBot = require('./index');

const bot = new NFTRarityBot();
const report = await bot.generateReport('0x...');
console.log(report);
```

## Configuration

Create a `.env` file with your API keys and configuration:

```bash
cp .env.example .env
```

Edit `.env` with your settings.