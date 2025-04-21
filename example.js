const NFTRarityBot = require('./index');

async function main() {
    const bot = new NFTRarityBot();
    
    // Example collection addresses
    const collections = [
        '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', // CryptoPunks
        '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'  // BAYC
    ];

    for (const address of collections) {
        console.log(`\n=== Analyzing Collection: ${address} ===`);
        try {
            await bot.analyze(address);
        } catch (error) {
            console.error(`Failed to analyze ${address}:`, error.message);
        }
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

if (require.main === module) {
    main().catch(console.error);
}