#!/usr/bin/env node

const NFTRarityBot = require('./index');
const Logger = require('./logger');

function showHelp() {
    console.log(`
NFT Rarity Bot CLI

Usage:
  node cli.js <command> [options]

Commands:
  analyze <contract_address>     Analyze NFT collection and show rarity rankings
  report <contract_address>      Generate detailed report with statistics
  help                          Show this help message

Options:
  --export                      Export results to JSON file
  --limit <number>              Limit number of NFTs to analyze (default: 50)
  --debug                       Enable debug mode

Examples:
  node cli.js analyze 0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb
  node cli.js report 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d --export
`);
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === 'help') {
        showHelp();
        return;
    }

    const command = args[0];
    const contractAddress = args[1];
    
    if (!contractAddress && command !== 'help') {
        Logger.error('Contract address is required');
        showHelp();
        process.exit(1);
    }

    const bot = new NFTRarityBot();
    const shouldExport = args.includes('--export');
    const limitIndex = args.indexOf('--limit');
    const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : 50;

    try {
        switch (command) {
            case 'analyze':
                Logger.info(`Analyzing collection: ${contractAddress}`);
                await bot.analyze(contractAddress);
                break;
                
            case 'report':
                Logger.info(`Generating report for: ${contractAddress}`);
                const report = await bot.generateReport(contractAddress);
                
                if (report) {
                    console.log('\n=== RARITY REPORT ===');
                    console.log(`Contract: ${report.contractAddress}`);
                    console.log(`Total NFTs: ${report.totalNFTs}`);
                    console.log(`Timestamp: ${report.timestamp}`);
                    console.log(`\nStatistics:`);
                    console.log(`  Highest Rarity: ${report.statistics.highestRarity}`);
                    console.log(`  Lowest Rarity: ${report.statistics.lowestRarity}`);
                    console.log(`  Average Rarity: ${report.statistics.averageRarity}`);
                    
                    if (shouldExport) {
                        await bot.exportToJSON(report, contractAddress);
                    }
                } else {
                    Logger.error('Failed to generate report');
                }
                break;
                
            default:
                Logger.error(`Unknown command: ${command}`);
                showHelp();
                process.exit(1);
        }
    } catch (error) {
        Logger.error('Command failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}