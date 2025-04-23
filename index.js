const axios = require('axios');
const fs = require('fs');
const path = require('path');
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

    async exportToJSON(data, contractAddress) {
        const filename = `${contractAddress}_rarity_${Date.now()}.json`;
        const filepath = path.join('./exports', filename);
        
        if (!fs.existsSync('./exports')) {
            fs.mkdirSync('./exports');
        }

        try {
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
            console.log(`Data exported to ${filepath}`);
            return filepath;
        } catch (error) {
            console.error('Error exporting data:', error.message);
            throw error;
        }
    }

    async generateReport(contractAddress) {
        const rarityData = await this.analyze(contractAddress);
        
        if (!rarityData || rarityData.length === 0) {
            return null;
        }

        const report = {
            contractAddress,
            totalNFTs: rarityData.length,
            timestamp: new Date().toISOString(),
            topRarest: rarityData.slice(0, 10),
            statistics: {
                highestRarity: Math.max(...rarityData.map(n => parseFloat(n.rarityScore))),
                lowestRarity: Math.min(...rarityData.map(n => parseFloat(n.rarityScore))),
                averageRarity: (rarityData.reduce((sum, n) => sum + parseFloat(n.rarityScore), 0) / rarityData.length).toFixed(2)
            }
        };

        return report;
    }
}

module.exports = NFTRarityBot;