const axios = require('axios');
require('dotenv').config();

class NFTRarityBot {
    constructor() {
        this.collections = new Map();
        this.apiKey = process.env.OPENSEA_API_KEY;
    }

    async fetchCollection(contractAddress) {
        console.log(`Fetching collection data for ${contractAddress}...`);
        
        try {
            const response = await axios.get(
                `https://api.opensea.io/api/v1/assets?asset_contract_address=${contractAddress}&limit=50`,
                {
                    headers: {
                        'X-API-KEY': this.apiKey
                    }
                }
            );
            
            return response.data.assets;
        } catch (error) {
            console.error('Error fetching collection:', error.message);
            return [];
        }
    }

    calculateRarity(nfts) {
        const traitCounts = {};
        const totalNFTs = nfts.length;

        console.log(`Analyzing ${totalNFTs} NFTs for rarity calculation...`);

        nfts.forEach(nft => {
            if (nft.traits) {
                nft.traits.forEach(trait => {
                    const key = `${trait.trait_type}:${trait.value}`;
                    traitCounts[key] = (traitCounts[key] || 0) + 1;
                });
            }
        });

        return nfts.map(nft => {
            let rarityScore = 0;
            
            if (nft.traits) {
                nft.traits.forEach(trait => {
                    const key = `${trait.trait_type}:${trait.value}`;
                    const frequency = traitCounts[key] / totalNFTs;
                    rarityScore += 1 / frequency;
                });
            }

            return {
                tokenId: nft.token_id,
                name: nft.name,
                rarityScore: rarityScore.toFixed(2),
                traits: nft.traits
            };
        });
    }

    async analyze(contractAddress) {
        const nfts = await this.fetchCollection(contractAddress);
        
        if (nfts.length === 0) {
            console.log('No NFTs found for this collection.');
            return;
        }

        const rarityData = this.calculateRarity(nfts);
        
        rarityData.sort((a, b) => parseFloat(b.rarityScore) - parseFloat(a.rarityScore));
        
        console.log('\nTop 10 Rarest NFTs:');
        rarityData.slice(0, 10).forEach((nft, index) => {
            console.log(`${index + 1}. ${nft.name} - Score: ${nft.rarityScore}`);
        });

        return rarityData;
    }
}

module.exports = NFTRarityBot;